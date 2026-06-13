import BlockModel from "./BlockModel.js";
import FlatModel from "./FlatModel.js";
import UserModel from "./UserModel.js";
import SlotModel from './SlotModel.js'
import BookingModel from "./BookingModel.js";
import ServiceModel from "./ServiceModel.js";

// Block -> Flats
BlockModel.hasMany(FlatModel, {
  foreignKey: "blockId",
  as: "flats",
});

FlatModel.belongsTo(BlockModel, {
  foreignKey: "blockId",
  as: "block",
});

// Flat -> Users
FlatModel.hasMany(UserModel, {
  foreignKey: "flatId",
  as: "residents",
});

UserModel.belongsTo(FlatModel, {
  foreignKey: "flatId",
  as: "flat",
});

UserModel.hasMany(BookingModel
    ,{
        foreignKey:"userId"
});

BookingModel.belongsTo(UserModel,{
    foreignKey:"userId"
});

BookingModel.belongsTo(ServiceModel,{
    foreignKey:"serviceId"
});

SlotModel.hasMany(BookingModel,{
    foreignKey:"slotId"
});
BookingModel.belongsTo(SlotModel,{
    foreignKey:"slotId"
});

export { BlockModel, FlatModel, UserModel };