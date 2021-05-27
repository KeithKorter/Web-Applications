httprequest.addHeader('Authorization', metadata.account.apikey);
var offset = 0;
var limit = 50;

if (metadata.report === "Projects") {
    doProjectStuff();
} else if (metadata.report === "ProjectNotes") {
    doProjectNoteStuff();
} else if (metadata.report === "TaskNotes") {
    doTaskNoteStuff();
} else if (metadata.report === "Tasks") {
    doTaskStuff();
} else if (metadata.report === "ProjectTags") {
    doProjectTagStuff();
}

function doProjectStuff() {

    // Build rows for the various projects
    datagrid.addColumn('Project ID', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Name', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Active Milestones', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Status', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Manager', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Started On', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Project End On', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('ProjectProjected End Date', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Total Task Count', datagrid.DATA_TYPE_DOUBLE);

    do {
        var res = httprequest.get('https://api.guidecx.com/api/v1/projects?limit=' + limit + '&offset=' + offset);

        var project = JSON.parse(res).projects;

        project.forEach(function (project) {
            datagrid.addCell(project.id || '');
            datagrid.addCell(project.name || '');
            datagrid.addCell(project.activeMilestones.join(', ') || '');
            datagrid.addCell(project.status || '');
            datagrid.addCell(project.projectManager.firstName + " " + project.projectManager.lastName || '');
            datagrid.addCell(project.startOn || '');
            datagrid.addCell(project.endOn || '');
            datagrid.addCell(project.projectedEndDate || '');
            datagrid.addCell(project.tasksCount);
            datagrid.endRow();
        });

        offset += limit;
    } while(project && project.length == limit);

}

function doTaskStuff() {

    datagrid.addColumn('Project ID', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task ID', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Name', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Status', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Responisibility', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Start Date', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Task Due Date', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Task Duration', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Estimated Hours', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Actual Hours', datagrid.DATA_TYPE_STRING);

    //Need the project ID
    do {
        var res = httprequest.get('https://api.guidecx.com/api/v1/projects?limit=' + limit + '&offset=' + offset);

        var project = JSON.parse(res).projects;

        project.forEach(function (project) {

            var offsetStep = 0;

            do {
                var resString = httprequest.get('https://api.guidecx.com/api/v1/projects/' + project.id + '/tasks?limit=' + limit + '&offset=' + offsetStep);

                var tasks = JSON.parse(resString).tasks;

                tasks.forEach(function (task) {
                    datagrid.addCell(project.id);
                    datagrid.addCell(task.id);
                    datagrid.addCell(task.name);
                    datagrid.addCell(task.status.replace(/_/g, ' '));
                    datagrid.addCell(task.responsibility);
                    datagrid.addCell(task.startOn);
                    datagrid.addCell(task.dueOn);
                    datagrid.addCell(task.duration);
                    datagrid.addCell(task.estimatedHours);
                    datagrid.addCell(task.actualHours);
                    datagrid.endRow();
                });

                offsetStep += limit;
            } while(tasks && tasks.length == limit);
        });

        offset += limit;
    } while(project && project.length == limit);

}

function doTaskNoteStuff() {

    datagrid.addColumn('Project ID', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Task ID', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Task Note ID', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Notes', datagrid.DATA_TYPE_STRING);

    //Need the project ID
    do {
        var res = httprequest.get('https://api.guidecx.com/api/v1/projects?limit=' + limit + '&offset=' + offset);

        var project = JSON.parse(res).projects;

        project.forEach(function (project) {

            var offsetStep = 0;

            do {
                var resString = httprequest.get('https://api.guidecx.com/api/v1/projects/' + project.id + '/tasks?limit=' + limit + '&offset=' + offsetStep);

                var tasks = JSON.parse(resString).tasks;

                tasks.forEach(function (task) {

                    task.notes.forEach(function (note) {
                        datagrid.addCell(project.id);
                        datagrid.addCell(task.id);
                        datagrid.addCell(note.id);
                        datagrid.addCell(note.text);
                        datagrid.endRow();
                    });
                });

                offsetStep += limit;
            } while(tasks && tasks.length == limit);
        });

        offset += limit;
    } while(project && project.length == limit);

}

function doProjectNoteStuff() {

    datagrid.addColumn('Project ID', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Note ID', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Date Created', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Project Note', datagrid.DATA_TYPE_STRING);

    //Need the project ID
    do {
        var res = httprequest.get('https://api.guidecx.com/api/v1/projects?limit=' + limit + '&offset=' + offset);

        var project = JSON.parse(res).projects;

        project.forEach(function (project) {

            var offsetStep = 0;

            do {
                var resString = httprequest.get('https://api.guidecx.com/api/v1/projects/' + project.id + '/notes?limit=' + limit + '&offset=' + offsetStep);

                var projectNotes = JSON.parse(resString);

                projectNotes.forEach(function (note) {
                    datagrid.addCell(project.id);
                    datagrid.addCell(note.id);
                    datagrid.addCell(note.createdAt);
                    datagrid.addCell(note.text);
                    datagrid.endRow();
                });

                offsetStep += limit;
            } while(projectNotes && projectNotes.length == limit);
        });

        offset += limit;
    } while(project && project.length == limit);

}

function doProjectTagStuff() {

    datagrid.addColumn('Project ID', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Name', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Tag', datagrid.DATA_TYPE_STRING);

    do {
        var res = httprequest.get('https://api.guidecx.com/api/v1/projects?limit=' + limit + '&offset=' + offset);

        var projects = JSON.parse(res).projects;

        projects.forEach(function(project) {

            if (project.tags.length === 0) {
                datagrid.addCell(project.id);
                datagrid.addCell(project.name);
                datagrid.addCell('(no tags)');
                datagrid.endRow();
            } else {
                project.tags.forEach(function(tag) {
                    datagrid.addCell(project.id);
                    datagrid.addCell(project.name);
                    datagrid.addCell(tag);
                    datagrid.endRow();
                })
            }
        });

        offset += limit;
    } while(projects && projects.length == limit);

}

