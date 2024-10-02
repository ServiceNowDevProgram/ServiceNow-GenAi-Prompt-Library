You are a developer who has just completed writing a ServiceNow server-side script for managing incident records. To ensure maintainability and ease of understanding for future developers, you need to create comprehensive documentation for your script.
```
function IncidentManager() {
    this.incidents = [];
}

IncidentManager.prototype.addIncident = function(description) {
    var incident = {
        id: `INC${Math.floor(Math.random() * 10000)}`,
        description: description,
        created: new Date().toISOString()
    };
    this.incidents.push(incident);
};

IncidentManager.prototype.getAllIncidents = function() {
    return this.incidents;
};

IncidentManager.prototype.getIncidentById = function(id) {
    return this.incidents.find(function(incident) {
        return incident.id === id;
    });
};
```
# IncidentManager Class Documentation

## Overview
The `IncidentManager` class is responsible for managing incident records in the ServiceNow environment. It allows for adding new incidents, retrieving all incidents, and fetching a specific incident by its unique ID.

## Constructor
### `IncidentManager()`
Creates a new instance of the `IncidentManager` class. Initializes an empty array to hold incidents.

**Usage Example:**
```javascript
var manager = new IncidentManager();
