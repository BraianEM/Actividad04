import db from '../db/connection.js'
import { DataTypes } from 'sequelize'

const Producto = db.define('producto',
{
    nombre: { type: DataTypes.STRING},
    tipo: { type: DataTypes.STRING},
    precio: { type: DataTypes.STRING}
},
{
    tableName:'productos',
    timestamps: false
} 
)

export default Producto