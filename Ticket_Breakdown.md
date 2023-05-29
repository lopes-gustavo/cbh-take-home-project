# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. 
We're working on a new feature which will generate reports for our client Facilities containing info on
how many hours each Agent worked in a given quarter by summing up every Shift they worked. 
Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.



## Your Breakdown Here
> Assumptions:
> 1. We're creating a new page called Agent Profile, to save/update all the editable info regarding an agent, 
> related to each Facility. In this first iteration, the page would contain readonly info like agent's name and so on, 
> and have an editable field for the custom agent id. The idea is so, so we can have additional info there, like custom 
> comment, past shifts, etc
> 2. There are 2 different frontend applications (one for the Facility, one for the Agent) and a single backend one.


### Task 1
#### Title
Add a new table to save the custom agent id

#### Description
In order to save and retrieve the custom agent id, we need a new table on the database.

Since each Facility can create a custom id for each Agent, we have a many-to-many relationship.

- Table name: `fac_agent`
- Columns:
  - `fac_id`
    - FK com `fac_id` in Facility table
  - `agent_id`
    - FK com `agent_id` in Agent table
  - `custom_agent_id`
    - Column type: `varchar(36)` // We need to get with the UI team the max size of this field. Assuming 36 for now.
- Indexes:
  - Unique index on `fac_id` + `agent_id` (one agent can have only one custom id on each facility)

It's **not** part of the scope:
- Performance and optimizations (it'll be done on a following iteration)


### Task 2
#### Title
Create a new page for the Facility user to manage the Agents they work with.

#### Description
To give the ability for a Facility to save the custom agent id, we'll create a new page called `Agent Profile`.

- The page should follow [this mockup](linkToMockup)
- The page should live in the uri `/agents/:agentId`
- The agent profile API is (see [Task $4](linkToTask)):
  - `GET /facility/:facilityId/agent/:agentId`
  - `PATCH /facility/:facilityId/agent/:agentId`
    - Payload (body + json):
    - ```
      {
        customAgentId: <string> (max-size: 36)
      }
      ```

It's **not** part of the scope:
- Adding a link to this page to any menu (it'll be done in [task #3](linkToTask))
- Creating the `/agents` page

### Test Scenarios
- ........


### Task 3
#### Title
Update the Shifts page (Facility view) to add a clickable link for the Agent

#### Description
For the Facility user only, we need to update the Shifts page to contain a link for the Agent Profile.

- The page should follow [this mockup](linkToMockup)
- This update must be done under a feature flag named `NEW_AGENTS_PROFILE_PAGE`.
  - The flag can only be turned on after [Task #2](linkToTask) is finished.

It's **not** part of the scope:
- Adding a link to this page to any menu (it'll be done in [this task](linkToTask))

### Test Scenarios
- When clicking 


### Task 4
#### Title
Create a new endpoint to read the Facility/Agent relationship

#### Description
- Endpoint: `GET /facility/:facilityId/agent/:agentId`

Validations:
Validate if the user trying to get the data has permission to do so. 
For this particular scenario, only the facility user will use the endpoint:
  - Get the userType for the logged user. If it's Facility User, then validate if it's id === `:facilityId`
  - Return 401 if failed

Ps. The endpoint is designed like that, so it can scale for other user types, like admins updating they info.

Return:
Return the Agent data, together with the custom fields. The query should be similar to:
```sql
  select * 
  from agents a
  left join fac_agent fa on a.id = fa.agent_id
  where a.id = :agentId and fa.fac_id = :facilityId
```

### Test Scenarios
- When clicking 



### Task 5
#### Title
Create a new endpoint to save the Facility/Agent relationship

#### Description
- Endpoint: `PATCH /facility/:facilityId/agent/:agentId`
- Payload (body + json):
  - ```
      {
        customAgentId: <string> (max-size: 36)
      }
      ```

Validations:
- Validate if the user trying to get the data has permission to do so.
For this particular scenario, only the facility user will use the endpoint:
  - Get the userType for the logged user. If it's Facility User, then validate if it's id === `:facilityId`
  - Return 401 if failed
- Validate if `customAgentId` size is lte 36.
  - Return 400 if failed

Ps. The endpoint is designed like that, so it can scale for other user types, like admins updating they info.

Return:
Update the Agent data and return 200 if everything worked. The query should be similar to:
```sql
  upsert fac_agent 
  set
   fac_id = :facilityId,
   agent_id = :agentId,
   custom_agent_id = customAgentId
  from fac_agent
```


### Test Scenarios
- When clicking 

