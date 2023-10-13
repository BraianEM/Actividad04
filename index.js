import { createRequire } from 'node:module'
import express from 'express'

import db from './db/connection.js'
import jwt from 'jsonwebtoken'
import Producto from './models/producto.js'
import Usuario from './models/usuarios.js'


const require = createRequire(import.meta.url)
const datos = require('./datos.json')


const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'

const app = express()

const exposedPort = 1234

function autenticacionDeToken(req, res, next){
    const headerAuthorization = req.headers['authorization']
    const tokenRecibido = headerAuthorization.split(" ")[1]

    if (tokenRecibido == null) {
        return res.status(401).json({message: 'Token no valido'})
    }

    let payload = null

    try{
        payload = jwt.verify(tokenRecibido, process.env.SECRET_KEY)
    } catch (error) {
        return res.status(401).json({message: 'Token no valido'})
    }

    if (Date.now() > payload.exp){
        return res.status(401).json({message: 'Token caducado'})
    }

    req.usuario = payload.sub

    next()
} 

app.use((req, res, next) => {
    if (req.method !== 'POST'){ return next()}

    if (req.headers['content-type'] !== 'application/json') { return next()}

    let bodyTemp = ''

    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })

    req.on('end', () => {
        const data = JSON.parse(bodyTemp)
        req.body = data
        next()
    })
})

app.use((req, res, next) => {
    if (req.method!== 'PATCH') { return next()}

    if (req.headers['content-type'] !== 'application/json') { return next()}

    let bodyTemp = ''

    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })

    req.on('end', () => {
        const data = JSON.parse(bodyTemp)
        req.body = data
        next()
    })
})

app.get('/', (req, res) => {
    res.status(200).send(html)
})


/// endpoint logeo
app.post('/auth', async (req, res) => {

    const usuarioABuscar = req.body.usuario
    const passwordRecibida = req.body.password
    let usuarioEncontrado = ''

    try {
        usuarioEncontrado = await Usuario.findAll({where:{usuario: usuarioABuscar}})

        if (usuarioEncontrado == '') { return res.status(400).json({message: 'Usuario no valido'})}
    } catch (error) {
        return res.status(400).json({message: 'Usuario no valido'})
    }

    if (usuarioEncontrado[0].password !== passwordRecibida){
        return res.status(400).json({message: 'Contraseña no valida'})
    }

    // Generacion del token

    const sub = usuarioEncontrado[0].id
    const usuario = usuarioEncontrado[0].usuario
    const nivel = usuarioEncontrado[0].nivel

    // Firma y construccion del token
    const token = jwt.sign({
        sub,
        usuario,
        nivel,
        exp: Date.now() + (60*1000)
    }, process.env.SECRET_KEY)

    res.status(200).json({ accessToken: token })

})


app.get('/productos', async (req, res) =>{
    try {
        const allProducts = await Producto.findAll()

        res.status(200).json(allProducts)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

app.get('/productos/:id', async (req, res) => {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = await Producto.findByPk(productoId)

        res.status(200).json(productoEncontrado)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

app.post('/productos', autenticacionDeToken, async (req, res) => {
    try {
        
            const productoAGuardar = new Producto(req.body)
            await productoAGuardar.save()
        
    
        res.status(201).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

app.patch('/productos/:id', autenticacionDeToken, async (req, res) => {
    let idProductoAEditar = parseInt(req.params.id)
    let productoAActualizar = await Producto.findByPk(idProductoAEditar)

    if (!productoAActualizar) {
        res.status(204).json({"message":"Producto no encontrado"})
    }


        await productoAActualizar.update(req.body)
      
        res.status(200).send('Producto actualizado')
    
})

app.delete('/productos/:id', autenticacionDeToken, async (req, res) => {
    let idProductoABorrar = parseInt(req.params.id)
    let productoABorrar = await Producto.findByPk(idProductoABorrar)

    if (!productoABorrar){
        res.status(204).json({"message":"Producto no encontrado"})
    }

    
    try {
        await productoABorrar.destroy()
    res.status(200).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})


// ejercicio 1 //

app.get('/usuarios', async (req, res) =>{
    try {
        const allUsers = await Usuario.findAll()

        res.status(200).json(allUsers)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

// ejercicio 2 //

app.get('/usuarios/:id', async (req, res) => {
    try {
        let userId = parseInt(req.params.id)
        let userEncontrado = await Usuario.findByPk(userId)

        if (!userEncontrado) {
            res.status(204).json({ "message": "Usuario no encontrado"})
        }

        res.status(200).json(userEncontrado)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

// ejercicio 3 //

app.post('/usuarios', autenticacionDeToken, async (req, res) => {
    try {
       
            const productosAGuardar = new Usuario(req.body)
            await productosAGuardar.save()
        
    
        res.status(201).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

// ejercicio 4 //

app.patch('/usuarios/:id', autenticacionDeToken, async (req, res) => {
    let idUserAEditar = parseInt(req.params.id)
    let userAActualizar = await Usuario.findByPk(idUserAEditar)

    if (!userAActualizar) {
        res.status(204).json({"message":"Usuario no encontrado"})
    }
        
        await userAActualizar.update(req.body)

        res.status(200).send('Usuario actualizado')
})

// Ejercicio 5 //
app.delete('/usuarios/:id', autenticacionDeToken, async (req, res) => {
    let idUserABorrar = parseInt(req.params.id)
    let userABorrar = await Usuario.findByPk(idUserABorrar)

    if (!userABorrar){
        res.status(204).json({"message":"Producto no encontrado"})
    }


    try {
         await userABorrar.destroy()
    res.status(200).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

// Ejercicio 6 //

app.get('/productos/precios/:id', async (req, res) => {
    try {
        const productoId = parseInt(req.params.id); 
        const producto = await Producto.findOne({ where: { id:productoId}})

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Devuelve el precio del producto
        res.status(200).json({ precio: producto.precio });
    } catch (error) {
        console.error(error)
        res.status(204).json({"message": "error"})
    }
});

// Ejercicio 7 //

app.get('/productos/nombres/:id', async (req, res) => {
    try {
        const productoId = parseInt(req.params.id); 
        const producto = await Producto.findOne({where: {id:productoId}})

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ nombre: producto.nombre });
    } catch (error) {
        console.error(error)
        res.status(204).json({"message": "error"})
    }
});

// Ejercicio 8 //

app.get('/usuarios/telefono/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const usuario = await Usuario.findOne({where: {id:userId}})

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Devuelve el telefono del usuario
        res.status(200).json({ telefono: usuario.telefono });
    } catch (error) {
        console.error(error)
        res.status(204).json({"message": "error"})
    }
});

// Ejercicio 9 //

app.get('/usuarios/nombres/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const usuario = await Usuario.findOne({where: {id:userId}})

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Devuelve el telefono del usuario
        res.status(200).json({ nombre: usuario.nombre });
    } catch (error) {
        console.error(error)
        res.status(204).json({"message": "error"})
    }
});

// Ejercicio 10 

app.get('/products/total/', async (req, res) => {
    try {
        const productos = await Producto.findAll();

        const precioTotal = productos.reduce((total, productos) => total + productos.precio, 0);

        res.status(200).json({ precioTotal: precioTotal.toFixed(2) }); // Limita el número de decimales a 2
    } catch (error) {
        console.error(error)
        res.status(204).json({"message": "error"})
    }
});


app.use((req, res) => {
    res.status(404).send('<h1>404</h1>')
})

try {
    db.authenticate()
    console.log('funcionó')
} catch (error) {
    console.log('error db')
    
}

app.listen( exposedPort, () => {
    console.log('Servidor escuchando en http://localhost:' + exposedPort)
})

