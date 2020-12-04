# Modules

Here I'll try to explain what the general structure of a module should be.

## General Structure

Supported File Extensions: {.ts,.js,.d.ts,.tsx,.jsx,.css,.less}

```
modules/
    {moduleName}/
        client/
            {name}Slice
            index
        server/
            migrations/
                {TIMESTAMP}-{migrationName}
            seeders/
                {TIMESTAMP}-{seederName}
            models/
                {modelName}
            plugins/
                {pluginName}
            routes/
                {routeName}
        config{.json,.js}
```

### General

{moduleName} => becomes your `module.id` in db

config{.json,.js} => where you define your module name version

### Client

_add client interface for adding routes_

{name}Slice => default export in the reducer

index => Home page of module

### Server

{TIMESTAMP}-{migrationName} | {TIMESTAMP}-{seederName} => TIMESTAMP should be like `YYYYMMDDHHMMSS`, {migration|seeder}\_Name should describe what the seeder of migration is doing seperated with `-`. (ex. 20200311163633-added-deleted-by-for-forumPost.js)

{modelName} => the db table will be the plural version {modelName}`s`

## Example Module

Example structure:

```
modules/
    exampleModule/
        client/
            index.jsx
            Example.jsx
            styling/
                test.less
                test.css
        server/
            plugins/
                examplePlugin.js
            routes/
                exampleRoute.ts
        config.json
```

Example Config:

```json
{
  "name": "Example Module",
  "version": "0.0.1"
}
```
