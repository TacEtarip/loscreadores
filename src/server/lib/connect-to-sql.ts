import { config } from 'mssql';

export class ConeccionSQL {
    private configuracion: config;

    constructor(server: string, user: string, password: string, database: string) {
        this.configuracion = { server, database, user, password, options: { encrypt: true, trustServerCertificate: false } };
    }

    get getConfig(): config {
        return this.configuracion;
    }

    /*
    crearQuery(requestString: string): tedious.Request {
        const request = new tedious.Request(requestString, null);
        return request;
    }

    realizarQuery(requestString: string): Promise<{value: any, metadata: {colName: any}}[]> {
        return new Promise((resolve, reject) => {
            let rowsResult: any [];
            const request = new tedious.Request(requestString, (err) => {
                if (err) {
                    return reject(err);
                }
            });
            request.on('doneInProc', (rowCount, more, rows) => {
                rows.forEach((r: {value: unknown, metadata: {colName: string}}[]) => {
                    r.map(c => {
                        console.log(c.value);
                        return c.value
                    });
                });
            })
            request.on('requestCompleted', () => {
                return resolve(rowsResult);
            })
            this.coneccion.execSql(request)
        })
    }

    
    conectar(): Promise<{conectado: boolean}> {
        return new Promise((resolve, reject) => {
            this.coneccion.connect();
            this.coneccion.on('connect', (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve({conectado: true});
            })
        })
    }*/
}
