import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const datos = require('./datos.json')

import express from 'express'
const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'

const app = express()

const exposedPort = 1234

app.get('/', (req, res) => {
    res.status(200).send(html)
})

// Ejercicio 10 //

app.get('/productos/total/', (req, res) => {
    try {
        // Calcula la sumatoria de los precios individuales de todos los productos
        const precioTotal = datos.productos.reduce((total, producto) => total + producto.precio, 0);

        // Devuelve el precio total
        res.status(200).json({ precioTotal: precioTotal.toFixed(2) }); // Limita el número de decimales a 2
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

app.get('/productos', (req, res) =>{
    try {
        let allProducts = datos.productos

        res.status(200).json(allProducts)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

app.get('/productos/:id', (req, res) => {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

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
    
        req.on('end', () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            datos.productos.push(req.body)
        })
    
        res.status(201).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

app.patch('/productos/:id', (req, res) => {
    let idProductoAEditar = parseInt(req.params.id)
    let productoAActualizar = datos.productos.find((producto) => producto.id === idProductoAEditar)

    if (!productoAActualizar) {
        res.status(204).json({"message":"Producto no encontrado"})
    }

    let bodyTemp = ''

    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })

    req.on('end', () => {
        const data = JSON.parse(bodyTemp)
        req.body = data
        
        if(data.nombre){
            productoAActualizar.nombre = data.nombre
        }
        
        if (data.tipo){
            productoAActualizar.tipo = data.tipo
        }

        if (data.precio){
            productoAActualizar.precio = data.precio
        }

        res.status(200).send('Producto actualizado')
    })
})

app.delete('/productos/:id', (req, res) => {
    let idProductoABorrar = parseInt(req.params.id)
    let productoABorrar = datos.productos.find((producto) => producto.id === idProductoABorrar)

    if (!productoABorrar){
        res.status(204).json({"message":"Producto no encontrado"})
    }

    let indiceProductoABorrar = datos.productos.indexOf(productoABorrar)
    try {
         datos.productos.splice(indiceProductoABorrar, 1)
    res.status(200).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})


// ejercicio 1 //

app.get('/usuarios', (req, res) =>{
    try {
        let allUsers = datos.usuarios

        res.status(200).json(allUsers)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

// ejercicio 2 //

app.get('/usuarios/:id', (req, res) => {
    try {
        let userId = parseInt(req.params.id)
        let userEncontrado = datos.usuarios.find((usuarios) => usuarios.id === userId)

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
    
        req.on('end', () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            datos.usuarios.push(req.body)
        })
    
        res.status(201).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

// ejercicio 4 //

app.patch('/usuarios/:id', (req, res) => {
    let idUserAEditar = parseInt(req.params.id)
    let userAActualizar = datos.usuarios.find((usuarios) => usuarios.id === idUserAEditar)

    if (!userAActualizar) {
        res.status(204).json({"message":"Usuario no encontrado"})
    }

    let bodyTemp = ''

    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })

    req.on('end', () => {
        const data = JSON.parse(bodyTemp)
        req.body = data
        if (data.id){
            userAActualizar.id = data.id
        }
        if(data.nombre){
            userAActualizar.nombre = data.nombre
        }
        
        if (data.edad){
            userAActualizar.edad = data.edad
        }

        if (data.email){
            userAActualizar.email = data.email
        }

        if (data.telefono){
            userAActualizar.telefono = data.telefono
        }

        res.status(200).send('Producto actualizado')
    })
})

// Ejercicio 5 //
app.delete('/usuarios/:id', (req, res) => {
    let idUserABorrar = parseInt(req.params.id)
    let userABorrar = datos.usuarios.find((usuarios) => usuarios.id === idUserABorrar)

    if (!userABorrar){
        res.status(204).json({"message":"Producto no encontrado"})
    }

    let indiceUsuarioABorrar = datos.usuarios.indexOf(userABorrar)
    try {
         datos.usuarios.splice(indiceUsuarioABorrar, 1)
    res.status(200).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

// Ejercicio 6 //

app.get('/productos/precios/:id', (req, res) => {
    try {
        const productoId = parseInt(req.params.id); // Obtiene el ID del producto desde la URL y lo convierte a un número entero

        // Busca el producto en la lista de productos por ID
        const producto = datos.productos.find((productos) => productos.id === productoId);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Devuelve el precio del producto
        res.status(200).json({ precio: producto.precio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ejercicio 7 //

app.get('/productos/nombres/:id', (req, res) => {
    try {
        const productoId = parseInt(req.params.id); // Obtiene el ID del producto desde la URL y lo convierte a un número entero

        // Busca el producto en la lista de productos por ID
        const producto = datos.productos.find((productos) => productos.id === productoId);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Devuelve el nombre del producto
        res.status(200).json({ nombre: producto.nombre });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ejercicio 8 //

app.get('/usuarios/telefono/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id); // Obtiene el ID del usuario desde la URL y lo convierte a un número entero

        // Busca el usuario en la lista de usuarios por ID
        const usuario = datos.usuarios.find((usuarios) => usuarios.id === userId);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Devuelve el telefono del usuario
        res.status(200).json({ telefono: usuario.telefono });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ejercicio 9 //

app.get('/usuarios/nombres/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id); // Obtiene el ID del usuario desde la URL y lo convierte a un número entero

        // Busca el usuario en la lista de usuarios por ID
        const usuario = datos.usuarios.find((usuarios) => usuarios.id === userId);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Devuelve el telefono del usuario
        res.status(200).json({ nombre: usuario.nombre });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ejercicio 10 //

app.get('/productos/total/', (req, res) => {
    try {
        // Calcula la sumatoria de los precios individuales de todos los productos
        const precioTotal = datos.productos.reduce((total, producto) => total + producto.precio, 0);

        // Devuelve el precio total
        res.status(200).json({ precioTotal: precioTotal.toFixed(2) }); // Limita el número de decimales a 2
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});



app.use((req, res) => {
    res.status(404).send('<h1>404</h1>')
})

app.listen( exposedPort, () => {
    console.log('Servidor escuchando en http://localhost:' + exposedPort)
})

