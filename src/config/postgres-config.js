require('dotenv').config();

/* FIXME: host should be 'postgis'(docker container name) while quering and 'localhost' while migations and seeds
simillarly port should be of the host's when migrating and seeding and of the container's when quering.
*/

exports.postgresConfig = {
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: +process.env.POSTGRES_CONTAINER_PORT
}