import * as Asana from 'asana';

const client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = process.env.ASANA_ACCESS_TOKEN;
const workspacesApi = new Asana.WorkspacesApi();
const projectsApi = new Asana.ProjectsApi();

async function run() {
  try {
    const workspaces = await workspacesApi.getWorkspaces({});
    console.log("Workspaces:", workspaces.data.map(w => w.gid));
    
    if (workspaces.data.length > 0) {
      const workspaceGid = workspaces.data[0].gid;
      console.log("Fetching projects for workspace:", workspaceGid);
      const projects = await projectsApi.getProjectsForWorkspace(workspaceGid, { limit: 100 });
      console.log(projects.data);
    }
  } catch (e) {
    if (e.response) {
        console.error("Error response:", await e.response.text);
    } else {
        console.error(e);
    }
  }
}
run();