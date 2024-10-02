Prompt: Develop a Scripted REST API in ServiceNow to retrieve specific incident data based on query parameters. This API should allow external applications to access incident details in a structured format.

Structure: Outline the steps for creating the API, including endpoint definitions, input parameters, and response formatting.

Expected Output:

Define API Endpoint:

Specify the endpoint (e.g., /api/incident/retrieve).
List accepted query parameters (e.g., sys_id, state).
  
Script Logic:
Provide a script to query incidents based on parameters.
  
Example:
var gr = new GlideRecord('incident');
if (current.sys_id) {
    gr.get(current.sys_id);
} else {
    gr.addQuery('state', current.state);
    gr.query();
}

Response Formatting:
Format the response in JSON.
Example:
var response = {};
response.incidents = [];
while (gr.next()) {
    response.incidents.push({
        sys_id: gr.sys_id,
        short_description: gr.short_description,
        state: gr.state
    });
}
return new sn_ws.Response(response);
Testing and Documentation:

Include instructions for testing the API.
Provide documentation for developers on how to use the API.
