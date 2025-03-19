import mysql from "mysql2/promise";

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const connection = await mysql.createConnection("mysql://beatriz:senha123Be!@localhost:3306/books_api");
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

export default connect();