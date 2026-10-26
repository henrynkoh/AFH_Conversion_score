import assert from "node:assert/strict";
import test from "node:test";
import {
  listingQueryXml,
  listingsFromXml,
  maskNwmlsUser,
  readNwmlsCredentials,
  redactSecrets,
  residentialToFacts,
  soapEnvelope,
} from "../src/lib/nwmls.ts";

const SAMPLE = `
<Listings>
  <Residential>
    <LN>2345678</LN>
    <ST>120 Cedar Ct SW</ST>
    <CIT>Tumwater</CIT>
    <LP>495000</LP>
    <BR>3</BR>
    <BTH>2</BTH>
    <GAR>2</GAR>
    <ASF>1680</ASF>
    <SWR>Public Sewer</SWR>
    <MR>Level rambler. Attached 2-car garage.</MR>
  </Residential>
  <Residential>
    <ST>No price house</ST>
  </Residential>
</Listings>`;

test("the EverNet query names the county and escapes the password once", () => {
  const query = listingQueryXml({
    user: "agent&id",
    password: "p&ass",
    county: "Thurston",
    begin: new Date("2026-10-01T00:00:00Z"),
    end: new Date("2026-10-22T00:00:00Z"),
  });
  assert.match(query, /<County>Thurston<\/County>/);
  assert.match(query, /<Status>A<\/Status>/);
  assert.match(query, /<UserId>agent&amp;id<\/UserId>/);
  assert.match(query, /<Password>p&amp;ass<\/Password>/);
  assert.equal(query.includes("p&ass<"), false);
  const envelope = soapEnvelope(query);
  assert.match(envelope, /RetrieveListingData/);
  assert.equal(envelope.includes("p&ass"), false);
});

test("a residential row becomes a Tumwater house with the listing number", () => {
  const [house] = listingsFromXml(SAMPLE);
  assert.ok(house);
  assert.equal(house?.address.includes("120 Cedar"), true);
  assert.equal(house?.listPrice, 495000);
  assert.equal(house?.beds, 3);
  assert.equal(house?.baths, 2);
  assert.equal(house?.garageSpaces, 2);
  assert.equal(house?.sewer, "public");
  assert.equal(house?.county, "thurston");
  assert.equal(house?.mlsNumber, "2345678");
  assert.equal(house?.levelEntry, "yes");
  assert.equal(listingsFromXml(SAMPLE).length, 1);
  assert.equal(residentialToFacts("<Residential><ST>Only street</ST></Residential>"), null);
});

test("credentials are read from the environment and secrets are masked", () => {
  assert.equal(readNwmlsCredentials({} as NodeJS.ProcessEnv), null);
  const credentials = readNwmlsCredentials({
    NWMLS_USER: "henry",
    NWMLS_PASSWORD: "secret-value",
  } as NodeJS.ProcessEnv);
  assert.equal(credentials?.user, "henry");
  assert.equal(maskNwmlsUser("henry"), "he•••");
  assert.equal(redactSecrets("login failed secret-value", credentials!), "login failed ••••");
});
