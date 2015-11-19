export const PORT = 8888;

export function knexInit() {
	return require('knex')({
	    client: 'pg',
	    connection: 'postgres://killem:killem@localhost/killem'
	});	
}