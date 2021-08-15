import config from '../src/config/config';
const configENV = process.env.NODE_ENV === 'development' ? config.development : config.production;


import { ConeccionSQL } from '../src/server/lib/connect-to-sql';

describe('Correcto SQL config', () => {
    const cofiguracionSQL = new ConeccionSQL('m1', 'm2', 'm3', 'm4').getConfig;
    it('Correcto Servidor', () => {
        expect(cofiguracionSQL.server).toBe('m1')
    })
    it('Correcto User', () => {
        expect(cofiguracionSQL.user).toBe('m2')
    });
    it('Correcto Password', () => {
        expect(cofiguracionSQL.password).toBe('m3')
    });
    it('Correcto DataBase', () => {
        expect(cofiguracionSQL.database).toBe('m4')
    });
});

