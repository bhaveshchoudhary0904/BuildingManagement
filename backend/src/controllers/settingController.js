const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getSettings = async (req, res) => {
  try {
    const settings = await prisma.settings.findMany();

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await prisma.settings.findUnique({
      where: { setting_key: key },
    });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await prisma.settings.update({
      where: { setting_key: key },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    const updatePromises = settings.map(setting => 
      prisma.settings.upsert({
        where: { setting_key: setting.key },
        update: { setting_value: setting.value },
        create: { setting_key: setting.key, setting_value: setting.value },
      })
    );

    const updatedSettings = await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      data: updatedSettings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
