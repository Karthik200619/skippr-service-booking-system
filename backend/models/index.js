import BlockModel from "./BlockModel.js";
import FlatModel from "./FlatModel.js";
import UserModel from "./UserModel.js";

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

export { BlockModel, FlatModel, UserModel };