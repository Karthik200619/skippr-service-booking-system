import {DataTypes} from "sequelize";
import sequelize from "../config/db.js";

const SlotModel=sequelize.define("Slot",{
 id:{
  type:DataTypes.INTEGER,
  primaryKey:true,
  autoIncrement:true
 },
 startTime:{
  type:DataTypes.STRING,
  allowNull:false
 },
 endTime:{
  type:DataTypes.STRING,
  allowNull:false
 },
 isActive:{
  type:DataTypes.BOOLEAN,
  defaultValue:true
 }
},{
 tableName:"slots"
});

export default SlotModel;