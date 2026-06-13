import exp from 'express'
export const AdminApi = exp.Router()

// 

AdminApi.post("/block", async (req, res) => {
  const { name, totalFloors, description } = req.body;

  const existingBlock = await BlockModel.findOne({
    where: { name },
  });

  if (existingBlock) {
    return res.status(409).json({
      message: "Block already exists",
    });
  }

  const block = await BlockModel.create({
    name,
    totalFloors,
    description,
  });

  res.status(201).json({
    message: "Block created successfully",
    payload: { block },
  });
});





AdminApi.post("/flat", async (req, res) => {
  const flatObj = req.body;

  const block = await BlockModel.findByPk(flatObj.blockId);

  if (!block) {
    throw new Error("Block not found");
  }

  const existingFlat = await FlatModel.findOne({
    where: {
      blockId:flatObj.blockId,
      flatNumber:flatObj.flatNumber,
    },
  });

  if (existingFlat) {
    throw new Error("Flat already exists in this block");
  }

  const flat = await FlatModel.create({blockId:flatObj.blockId,flatNumber:flatObj.flatNumber,floor:flatObj.floor,parkingSlot:flatObj.parkingSlot,bhkType:flatObj.bhkType});
  res.status(201).json({message: "Flat created successfully",payload: { flat },});
});