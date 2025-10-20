import Worker from "../models/Worker.model.js";
import User from "../models/user.model.js";

// Register new worker
export const registerWorker = async (req, res) => {
  try {
    const existingWorker = await Worker.findOne({ user: req.user._id });
    if (existingWorker) {
      return res.status(400).json({
        success: false,
        message: 'Worker profile already exists'
      });
    }

    const worker = await Worker.create({
      user: req.user._id,
      ...req.body
    });

    await User.findByIdAndUpdate(req.user._id, { role: 'worker' });

    res.status(201).json({ success: true, data: worker });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all workers with filters
export const getWorkers = async (req, res) => {
  try {
    const { status, specialization } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (specialization) filter.specializations = specialization;

    const workers = await Worker.find(filter)
      .populate('user', 'name email phone')
      .populate('activeRequests');

    res.status(200).json({
      success: true,
      count: workers.length,
      data: workers
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get worker by ID
export const getWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('activeRequests');

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    res.status(200).json({ success: true, data: worker });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update worker profile
export const updateWorker = async (req, res) => {
  try {
    const worker = await Worker.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    res.status(200).json({ success: true, data: worker });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update worker location
export const updateLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;
    const worker = await Worker.findOneAndUpdate(
      { user: req.user._id },
      { 
        currentLocation: {
          type: 'Point',
          coordinates
        }
      },
      { new: true }
    );

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    res.status(200).json({ success: true, data: worker });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get worker's assignments
export const getAssignments = async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id })
      .populate({
        path: 'activeRequests',
        populate: { path: 'user', select: 'name phone' }
      });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    res.status(200).json({
      success: true,
      count: worker.activeRequests.length,
      data: worker.activeRequests
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete worker profile
export const deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    await User.findByIdAndUpdate(worker.user, { role: 'citizen' });
    await worker.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
