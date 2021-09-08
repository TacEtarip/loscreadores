import { esNombreTipoValido } from '../src/server/controllers/materiales-control';

describe('Validar nombre usuario', () => {
    it('Nombre length correcto', () => {
        expect(esNombreTipoValido('test')).toBe(true);
    })
})