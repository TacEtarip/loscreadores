import { comprobarDatosRegistro, comprobarTipoDeBusqueda } from '../src/server/controllers/login-control';
import { Usuario, InfoContacto, PersonaNatural } from '../src/server/lib/interfaces';

const usuarioInfo = { username: 'TacEtarip2', contrasena_enviada: 'xxxxxxxxxx' } as Usuario;
const infoContacto = { codDistrito: '010101', celular: '142191327', correo_electronico: 'test@gmail.com', 
direccion_linea_uno: 'AV. XXXX', direccion_linea_dos: 'RESTO DE DIRECCION' } as InfoContacto;
const personaNaturalInfo = {
    DNI: '00309532', nombre: 'Unnombre', apellido_dos: 'Segundo', apellido_uno: 'Primero', fecha_nacimiento: new Date(1996, 11, 2),
} as PersonaNatural;


describe.skip('Datos Enviados Para Registro Son Correctos', () => {
    it('Datos Correctos', () => {
        const comprobacion = comprobarDatosRegistro(usuarioInfo, infoContacto, personaNaturalInfo);
        expect(comprobacion).toBe(true);
    })
});

test('Comprobar Tipo De Busqueda', () => {
    const tipoB = 1;
    const resultado = comprobarTipoDeBusqueda(tipoB);
    expect(resultado).toBe(true);
});

test('Comprobar Tipo Eliminar', () => {
    const tipoE = 1;
    const resultado = comprobarTipoDeBusqueda(tipoE);
    expect(resultado).toBe(true);
})