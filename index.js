import { createRequire } from 'node:module'
import express from 'express'

import db from './db/connection.js'
import Producto from './models/producto.js'
import Usuario from './models/usuarios.js'

const require = createRequire(import.meta.url)
const datos = require('./datos.json')


const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'

const app = express()

const exposedPort = 1234

app.get('/', (req, res) => {
    res.status(200).send(html)
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

app.post('/productos', (req, res) => {
    try {
        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        })
    
        req.on('end', async () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            const productoAGuardar = new Producto(req.body)
            await productoAGuardar.save()
        })
    
        res.status(201).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

app.patch('/productos/:id', async (req, res) => {
    let idProductoAEditar = parseInt(req.params.id)
    let productoAActualizar = await Producto.findByPk(idProductoAEditar)

    if (!productoAActualizar) {
        res.status(204).json({"message":"Producto no encontrado"})
    }

    let bodyTemp = ''

    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })

    req.on('end', async () => {
        const data = JSON.parse(bodyTemp)
        req.body = data

        await productoAActualizar.update(req.body)
      
        res.status(200).send('Producto actualizado')
    })
})

app.delete('/productos/:id', async (req, res) => {
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

app.post('/usuarios', (req, res) => {
    try {
        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        })
    
        req.on('end', async () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            const productosAGuardar = new Usuario(req.body)
            await productosAGuardar.save()
        })
    
        res.status(201).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

// ejercicio 4 //

app.patch('/usuarios/:id', async (req, res) => {
    let idUserAEditar = parseInt(req.params.id)
    let userAActualizar = await Usuario.findByPk(idUserAEditar)

    if (!userAActualizar) {
        res.status(204).json({"message":"Usuario no encontrado"})
    }

    let bodyTemp = ''

    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })

    req.on('end', async () => {
        const data = JSON.parse(bodyTemp)
        req.body = data
        
        await userAActualizar.update(req.body)

        res.status(200).send('Usuario actualizado')
    })
})

// Ejercicio 5 //
app.delete('/usuarios/:id', async (req, res) => {
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

