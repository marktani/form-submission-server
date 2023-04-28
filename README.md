# form-submission-server

Express server to submit and check form submissions. Built with Node, TypeScript, TypeORM, and Postgres.

## Project setup

Install dependencies:

```sh
npm install
```

Start `postgres` docker container:

```sh
docker-compose up -d
```

Seed with example form and fields:

```sh
npm run seed
```

Start form submission server:

```sh
npm run start
```

## Features and possible extentions

Currently supported:

- `string` and `number` field types, can be optional and required
- `minLength`/`maxLength` and `min`/`max` constraints for string/number fields respectively.
- basic form submission validation (all required fields are provided and all defined constraints are met) with detailed error messages for each case
- a simple user form for name and age submission

Possible extentions:

- An admin panel to edit existing form templates and create new ones.
- More field types like specific strings (emails, phone numbers with their own validations), files, or single-select/multi-select.
- Grouped fields.
- Form-level validations.
- More constraint types.
- Submission of invalid forms for later editing.

## Example requests

### Query data

Query all forms:

```sh
curl localhost:8080/forms
```

Query one form:

```sh
curl localhost:8080/forms/1
```

Query all form submissions:

```sh
curl localhost:8080/submissions
```

Query one form submission:

```sh
curl localhost:8080/submissions/1
```

### Successful form submissions

only required fields

```sh
curl -X POST localhost:8080/submit -H "Content-Type: application/json" -d \
'
{
  "formId": 1,
  "fields": [
    {"id": "1", "value": "Nilan"},
    {"id": "2", "value": "Marktanner"},
    {"id": "4", "value": "31"}
  ]
}
'
```

all fields, required and optional

```sh
curl -X POST localhost:8080/submit -H "Content-Type: application/json" -d \
'
{
  "formId": 1,
  "fields": [
   {"id": "1", "value": "Nilan"},
   {"id": "2", "value": "Marktanner"},
   {"id": "3", "value": "A second submission"},
   {"id": "4", "value": "31"}
  ]
}
'
```

### Wrong form format

misses `formId`

```sh
curl -X POST localhost:8080/submit -H "Content-Type: application/json" -d \
'
{
  "id": 1,
  "fields": [
   {"id": "1", "value": "Nilan"},
   {"id": "4", "value": "31"}
  ]
}
'
```

misses `fields`

```sh
curl -X POST localhost:8080/submit -H "Content-Type: application/json" -d \
'
{
  "formId": 1,
  "myFields": [
   {"id": "1", "value": "Nilan"},
   {"id": "4", "value": "31"}
  ]
}
'
```

### Invalid form submissions

required field is missing

```sh
curl -X POST localhost:8080/submit -H "Content-Type: application/json" -d \
'
{
  "formId": 1,
  "fields": [
   {"id": "1", "value": "Nilan"},
   {"id": "4", "value": "31"}
  ]
}
'
```

string too short

```sh
curl -X POST localhost:8080/submit -H "Content-Type: application/json" -d \
'
{
  "formId": 1,
  "fields": [
   {"id": "1", "value": ""},
   {"id": "2", "value": "Marktanner"},
   {"id": "4", "value": "31"}
  ]
}
'
```

string too long

```sh
curl -X POST localhost:8080/submit -H "Content-Type: application/json" -d \
'
{
  "formId": 1,
  "fields": [
   {"id": "1", "value": "Nilan"},
   {"id": "2", "value": "MarktannerMarktannerMarktannerMarktannerMarktannerMarktannerMarktannerMarktannerMarktannerMarktannerMarktannerMarktannerMarktannerMarktannerMarktannerMarktannerMarktannerMarktannerMarktannerMarktannerMarktanner"},
   {"id": "4", "value": "31"}
  ]
}
'
```

number too small

```sh
curl -X POST localhost:8080/submit -H "Content-Type: application/json" -d \
'
{
  "formId": 1,
  "fields": [
   {"id": "1", "value": "Nilan"},
   {"id": "2", "value": "Marktanner"},
   {"id": "4", "value": "0"}
  ]
}
'
```

number too large

```sh
curl -X POST localhost:8080/submit -H "Content-Type: application/json" -d \
'
{
  "formId": 1,
  "fields": [
   {"id": "1", "value": "Nilan"},
   {"id": "2", "value": "Marktanner"},
   {"id": "4", "value": "2000"}
  ]
}
'
```
