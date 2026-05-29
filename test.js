const Asana = require('asana');
const client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = process.env.ASANA_ACCESS_TOKEN;
const projectsApi = new Asana.ProjectsApi();

async function run() {
  try {
    const projects = await projectsApi.getProjectsForWorkspace("1204481600100790", {});
    console.log(projects.data);
  } catch (e) {
    console.error(e.response ? e.response.text : e);
  }
}
run();
