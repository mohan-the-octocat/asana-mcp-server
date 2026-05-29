import * as Asana from "asana";
import process from "process";

const ASANA_ACCESS_TOKEN = process.env.ASANA_ACCESS_TOKEN;
const WORKSPACE_GID = "8468971550303";

const client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = ASANA_ACCESS_TOKEN;

const customFieldsApi = new Asana.CustomFieldsApi();

async function test() {
  try {
    console.log("Testing with { data: ... }");
    const fieldData = {
      name: "DEBUG_TEST_1",
      workspace: WORKSPACE_GID,
      type: "text",
      is_global_to_workspace: false
    };
    const res1 = await customFieldsApi.createCustomField({ data: fieldData });
    console.log("Success 1:", res1.data.gid);
  } catch (e) {
    console.error("Fail 1:", e.message);
    if (e.body) console.error("Body 1:", JSON.stringify(e.body, null, 2));
  }

  try {
    console.log("Testing with { body: { data: ... } }");
    const fieldData = {
      name: "DEBUG_TEST_2",
      workspace: WORKSPACE_GID,
      type: "text",
      is_global_to_workspace: false
    };
    const res2 = await customFieldsApi.createCustomField({ body: { data: fieldData } });
    console.log("Success 2:", res2.data.gid);
  } catch (e) {
    console.error("Fail 2:", e.message);
    if (e.body) console.error("Body 2:", JSON.stringify(e.body, null, 2));
  }
}

test();
