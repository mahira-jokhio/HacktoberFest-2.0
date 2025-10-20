import Request from "../models/request.model.js";
import Worker from "../models/Worker.model.js";

// Create new request
export const createRequest = async (req, res) => {
  try {
    const request = await Request.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all requests with filters
export const getRequests = async (req, res) => {
  try {
    const { status, wasteType } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (wasteType) filter.wasteType = wasteType;

    const requests = await Request.find(filter)
      .populate('user', 'name email')
      .populate('assignedWorker', 'user status currentLocation');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get single request by ID
export const getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedWorker', 'user status currentLocation');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update request
export const updateRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Check ownership or admin role
    if (request.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Assign worker to request
export const assignWorker = async (req, res) => {
  try {
    const { workerId } = req.body;
    const request = await Request.findById(req.params.id);
    const worker = await Worker.findById(workerId);

    if (!request || !worker) {
      return res.status(404).json({ success: false, message: 'Request or worker not found' });
    }

    request.assignedWorker = workerId;
    request.status = 'assigned';
    await request.save();

    worker.activeRequests.push(request._id);
    await worker.save();

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update request status
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.status = status;
    if (status === 'completed') {
      const worker = await Worker.findById(request.assignedWorker);
      if (worker) {
        worker.completedRequests += 1;
        worker.activeRequests = worker.activeRequests.filter(
          req => req.toString() !== request._id.toString()
        );
        await worker.save();
      }
    }

    await request.save();
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete request
export const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await request.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
