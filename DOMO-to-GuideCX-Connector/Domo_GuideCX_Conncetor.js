httprequest.addHeader('Authorization', metadata.account.apikey);
var offset = 0;
var limit = 50;

if (metadata.report === "Projects") {
    doProjectStuff();
} else if (metadata.report === "ProjectNotes") {
    doProjectNoteStuff();
} else if (metadata.report === "ProjectCustomFields") {
    doProjectCustomFieldStuff();
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
    datagrid.addColumn('Project Customer', datagrid.DATA_TYPE_STRING); 
    datagrid.addColumn('Customer Domain', datagrid.DATA_TYPE_STRING); 
    datagrid.addColumn('Cash Value', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Active Milestones', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Status', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Manager', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Creation Date', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Project Start Date', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Project Planned End', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Project Forcasted End Date', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Project Updated At', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Project Completed At', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Project Done At', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Total Task Count', datagrid.DATA_TYPE_DOUBLE);
    datagrid.addColumn('Project Summary Hours Estimated', datagrid.DATA_TYPE_DOUBLE);
    datagrid.addColumn('Project Summary Hours Actual', datagrid.DATA_TYPE_DOUBLE);
    datagrid.addColumn('Project Internal Hours Estimated', datagrid.DATA_TYPE_DOUBLE);
    datagrid.addColumn('Project Internal Hours Actual', datagrid.DATA_TYPE_DOUBLE);
    datagrid.addColumn('Project Customer Hours Estimated', datagrid.DATA_TYPE_DOUBLE);
    datagrid.addColumn('Project Customer Hours Actual', datagrid.DATA_TYPE_DOUBLE);
    datagrid.addColumn('Project Third Party Hours Estimated', datagrid.DATA_TYPE_DOUBLE);
    datagrid.addColumn('Project Third Party Hours Actual', datagrid.DATA_TYPE_DOUBLE);
    
      function processProject(project){

        var res = httprequest.get('https://api.guidecx.com/api/v1/projects/' + project.id);
       //console.log(res)
       
        var project = JSON.parse(res)
        
                  
            datagrid.addCell(project.id || '');
            datagrid.addCell(project.name || '');
            datagrid.addCell(project.customer.name || '');  
            datagrid.addCell(project.customer.domain || ''); 
            datagrid.addCell(project.cashValue || '');
            datagrid.addCell(project.activeMilestones.join(', ') || '');
            datagrid.addCell(project.status || '');
            datagrid.addCell(project.projectManager.firstName + " " + project.projectManager.lastName || '');
            datagrid.addCell(project.createdAt || '');
            datagrid.addCell(project.startOn || '');
            datagrid.addCell(project.endOn || '');
            datagrid.addCell(project.projectedEndDate || '');
            datagrid.addCell(project.updatedAt || '');
            datagrid.addCell(project.completedAt || '');
            datagrid.addCell(project.doneAt || '');
            datagrid.addCell(project.tasksCount);
            datagrid.addCell(project.hours.summary.estimated || '');  
            datagrid.addCell(project.hours.summary.actual || ''); 
            datagrid.addCell(project.hours.internal.estimated || '');  
            datagrid.addCell(project.hours.internal.actual || ''); 
            datagrid.addCell(project.hours.customer.estimated || '');  
            datagrid.addCell(project.hours.customer.actual || ''); 
            datagrid.addCell(project.hours.thirdParty.estimated || '');  
            datagrid.addCell(project.hours.thirdParty.actual || ''); 
            datagrid.endRow();
          
          }
          
        

    do {
        var res = httprequest.get('https://api.guidecx.com/api/v1/projects?limit=' + limit + '&offset=' + offset);

        var project = JSON.parse(res).projects;
        project.forEach(processProject);
        
        offset += limit;
    } while(project && project.length == limit);

}


function doProjectCustomFieldStuff() {

    datagrid.addColumn('Project ID', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Name', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Custom Field ID', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Custom Field Name', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Custom Field Value', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Custom Field Internal Only', datagrid.DATA_TYPE_STRING);
  
      function processProject(project){

        var res = httprequest.get('https://api.guidecx.com/api/v1/projects/' + project.id);
        
        var project = JSON.parse(res)
        
        if(project.customFields.length > 0){
          
          project.customFields.forEach(function processCustomField(field){
            datagrid.addCell(project.id);
            datagrid.addCell(project.name);
            datagrid.addCell(field.id);
            datagrid.addCell(field.name);
            datagrid.addCell(field.value);
            datagrid.addCell(field.internalOnly); 
            datagrid.endRow(); 
          })
          
        }
        else{
          datagrid.addCell(project.id);
          datagrid.addCell(project.name);
          datagrid.addCell('(Null)');
          datagrid.addCell('(Null)');
          datagrid.addCell('(Null)');
          datagrid.addCell('(Null)');
          datagrid.endRow();
        }
        
        
       
      }
//Need the project ID  
    do {
        var res = httprequest.get('https://api.guidecx.com/api/v1/projects?limit=' + limit + '&offset=' + offset);

        var project = JSON.parse(res).projects;
        project.forEach(processProject);
        
        offset += limit;
    } while(project && project.length == limit);

}


function doTaskStuff() {

    datagrid.addColumn('Project ID', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task ID', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Name', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Status', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Responisibility', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Assignee', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Description', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Start Date', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Task Due Date', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Task Duration', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Completed At', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Task Type', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Estimated Hours', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Actual Hours', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Dependency Type', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Dependency ID', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Milestone ID', datagrid.DATA_TYPE_STRING);

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
                    

                    if (task.assignee)
                    {
                    datagrid.addCell(task.assignee.firstName + " " + task.assignee.lastName || ''); 

                    } else {
                      
                    datagrid.addCell((' '));
                    }
                  
                    datagrid.addCell(task.description);
                    datagrid.addCell(task.startOn);
                    datagrid.addCell(task.dueOn);
                    datagrid.addCell(task.duration);
                    datagrid.addCell(task.completedAt);
                    datagrid.addCell(task.type);
                    datagrid.addCell(task.estimatedHours);
                    datagrid.addCell(task.actualHours);
                    datagrid.addCell(task.dependencyType);
                    datagrid.addCell(task.dependencyId);
                    datagrid.addCell(task.milestoneId);
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
    datagrid.addColumn('Task Note Created At', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Task Note Created By', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Task Note Internal Only', datagrid.DATA_TYPE_STRING);
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
                        
                         if (note)
                    {
                        datagrid.addCell(note.createdAt);
                        datagrid.addCell(note.createdBy.firstName + " " + note.createdBy.lastName || '');
                        datagrid.addCell(note.internalOnly);

                    } else {
                    datagrid.addCell((' '));
                    datagrid.addCell((' '));
                    datagrid.addCell((' '));
                    }
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
    datagrid.addColumn('Project Date Note Created', datagrid.DATA_TYPE_DATETIME);
    datagrid.addColumn('Project Note Created By', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Note', datagrid.DATA_TYPE_STRING);
    datagrid.addColumn('Project Note Internal Only', datagrid.DATA_TYPE_STRING);

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
                    datagrid.addCell(note.createdBy.firstName + " " + note.createdBy.lastName || '');
                    datagrid.addCell(note.text);
                    datagrid.addCell(note.internalOnly);
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


