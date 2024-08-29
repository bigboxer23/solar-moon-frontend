# solar-moon-frontend

This project encompasses the front end (authenticated) for solar moon analytics.

The project is built in react and is intended to be deployed directly to an S3 bucket and served from there or via cloudfront.
It requires the [solar-moon-ingest-lambda](https://github.com/bigboxer23/solar-moon-ingest-lambda) project to be deployed
for backend services

### External Integrations

#### Stripe

Stripe is used to store customer information, including payment and subscription status and level. A stripe account and
private key is necessary.

#### AWS

AWS account access to an S3 bucket (and maybe cloudfront) is necessary to deploy this project. Backend services for this
are additionally hosted in AWS, though they exist in the `solar-moon-ingest-lambda` repo.

### Building

#### GitHub Action

- See `workflows/deploy.yml`. This action is integrated into the `master` branch such that any changes pushed trigger a
  rebuild and deploy of the project to the defined (in github secrets) s3 bucket.
- There are some necessary parameters to define in GitHub secrets:
  - `AWS_EXPORTS`
  - `REACT_APP_STRIPE_PK`
  - `REACT_APP_PRICE_MO`
  - `REACT_APP_PRICE_YR`
  - `REACT_APP_ACCESS_CODE`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `S3_BUCKET_REGION`
  - `S3_BUCKET`

#### Manually

- Scripts to build, deploy and rollback manually exist, see [solar-moon-server-config/website](https://github.com/bigboxer23/solar-moon-server-config/tree/main/scripts/website).
