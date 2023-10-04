import db from '../db/connection.js'
import { DataTypes } from 'sequelize'

const Usuario = db.define('Usuario', 
{
    nombre: {type: DataTypes.STRING},
    edad: {type: DataTypes.INTEGER},
    email: {type: DataTypes.STRING},
    telefono: {type: DataTypes.STRING},
},
{
    tableName:'usuarios',
    timestamps: false
}
)

export default Usuario