import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-hot-toast";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("PENDING"); // Default to pending to highlight tasks
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Edit Resident Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [flats, setFlats] = useState([]);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    occupantType: "",
    blockId: "",
    flatId: ""
  });

  useEffect(() => {
    loadUsers("PENDING");
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const res = await axios.get("/common-api/blocks");
      setBlocks(res.data.payload.blocks || []);
    } catch (err) {
      console.error("Failed to load blocks:", err);
    }
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 4000);
  };

  const loadUsers = async (status) => {
    setFetching(true);
    try {
      const query = status && status !== "ALL" ? `?approvalStatus=${status}` : "";
      const res = await axios.get(`/admin-api/users${query}`);
      setUsers(res.data.payload.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load residents list");
    } finally {
      setFetching(false);
    }
  };

  const handleUpdateStatus = async (userId, action) => {
    setLoading(true);
    setError(null);
    try {
      await axios.patch(`/admin-api/users/${userId}/${action}`);
      toast.success(`Resident registration request ${action}ed!`);
      showMessage(`Resident ${action}ed successfully.`);
      loadUsers(statusFilter);
    } catch (err) {
      setError(err.response?.data?.message || `Unable to ${action} resident registration`);
      toast.error(err.response?.data?.message || `Failed to ${action} resident`);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = async (resident) => {
    setEditingResident(resident);
    setEditForm({
      fullName: resident.fullName,
      email: resident.email,
      mobile: resident.mobile,
      occupantType: resident.occupantType || "",
      blockId: resident.flat?.blockId || "",
      flatId: resident.flatId || ""
    });
    setIsEditModalOpen(true);

    if (resident.flat?.blockId) {
      await loadFlatsForBlock(resident.flat.blockId, resident);
    } else {
      setFlats([]);
    }
  };

  const loadFlatsForBlock = async (blockId, resident) => {
    try {
      const res = await axios.get(`/common-api/flats/by-block/${blockId}`);
      let availableFlats = res.data.payload.flats || [];
      
      // If editing a resident, ensure their current flat is in the list
      const currentRes = resident || editingResident;
      if (currentRes && currentRes.flat && parseInt(currentRes.flat.blockId) === parseInt(blockId)) {
        const exists = availableFlats.some(f => parseInt(f.id) === parseInt(currentRes.flatId));
        if (!exists) {
          availableFlats.push({
            id: currentRes.flatId,
            flatNumber: currentRes.flat.flatNumber,
            bhkType: currentRes.flat.bhkType
          });
        }
      }
      setFlats(availableFlats);
    } catch (err) {
      console.error("Failed to load flats:", err);
      setFlats([]);
    }
  };

  const handleBlockChange = async (e) => {
    const blockId = e.target.value;
    setEditForm(prev => ({ ...prev, blockId, flatId: "" }));
    setFlats([]);
    if (blockId) {
      await loadFlatsForBlock(blockId);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.fullName || !editForm.email || !editForm.mobile || !editForm.occupantType || !editForm.flatId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await axios.put(`/admin-api/users/${editingResident.id}`, {
        fullName: editForm.fullName,
        email: editForm.email,
        mobile: editForm.mobile,
        occupantType: editForm.occupantType,
        flatId: parseInt(editForm.flatId)
      });
      toast.success("Resident details updated successfully!");
      setIsEditModalOpen(false);
      setEditingResident(null);
      loadUsers(statusFilter);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update resident details");
      toast.error(err.response?.data?.message || "Failed to update resident");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {(message || error) && (
        <section className="rounded-2xl p-4 shadow-sm">
          {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
          {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
        </section>
      )}

      <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Resident Approvals</h2>
            <p className="mt-2 text-sm text-slate-500">Review newly registered accounts and authorize access to flats.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-500">Filter:</span>
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  loadUsers(status);
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === status ? "bg-violet-600 text-white shadow-md shadow-violet-100" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[700px] divide-y divide-slate-200 text-left text-sm">
            <thead>
              <tr>
                <th className="py-3 pr-4 font-semibold text-slate-650">Resident</th>
                <th className="py-3 pr-4 font-semibold text-slate-650">Occupant Type</th>
                <th className="py-3 pr-4 font-semibold text-slate-650">Assigned Flat</th>
                <th className="py-3 pr-4 font-semibold text-slate-650">Verified Status</th>
                <th className="py-3 pr-4 font-semibold text-slate-650">Approval Status</th>
                <th className="py-3 font-semibold text-slate-650">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {fetching ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-sm text-slate-550">
                    Loading residents...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-sm text-slate-500">
                    No residents found matching this filter.
                  </td>
                </tr>
              ) : (
                users.map((resident) => (
                  <tr key={resident.id} className="hover:bg-slate-50">
                    {/* User profile & details */}
                    <td className="py-4 pr-4 align-middle text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100 flex-shrink-0 border border-slate-200">
                          {resident.profileImageUrl ? (
                            <img src={resident.profileImageUrl} alt="avatar" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-bold text-violet-600 bg-violet-50">
                              {resident.fullName?.[0]?.toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold">{resident.fullName}</div>
                          <div className="text-xs text-slate-500">{resident.email}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{resident.mobile}</div>
                        </div>
                      </div>
                    </td>

                    {/* Occupant Type */}
                    <td className="py-4 pr-4 align-middle text-slate-800 font-semibold text-xs">
                      <span className={`inline-flex rounded-md px-2.5 py-1 ${
                        resident.occupantType === "OWNER" ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-teal-50 text-teal-700 border border-teal-100"
                      }`}>
                        {resident.occupantType || "N/A"}
                      </span>
                    </td>

                    {/* Assigned Flat info */}
                    <td className="py-4 pr-4 align-middle text-slate-800">
                      {resident.flat ? (
                        <div>
                          <div className="font-semibold text-slate-900">Flat {resident.flat.flatNumber}</div>
                          <div className="text-xs text-slate-500">Block {resident.flat.block?.name || resident.flat.blockId} • Floor {resident.flat.floor}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No flat assigned</span>
                      )}
                    </td>

                    {/* Verified Status (OTP) */}
                    <td className="py-4 pr-4 align-middle">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        resident.isVerified ? "text-emerald-600" : "text-slate-400"
                      }`}>
                        <span className={`h-2.5 w-2.5 rounded-full ${resident.isVerified ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                        {resident.isVerified ? "Verified (OTP)" : "Pending Verification"}
                      </span>
                    </td>

                    {/* Approval Status (Admin) */}
                    <td className="py-4 pr-4 align-middle">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        resident.approvalStatus === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : resident.approvalStatus === "REJECTED"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {resident.approvalStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 align-middle">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openEditModal(resident)}
                          className="rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-750"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(resident.id, "approve")}
                          disabled={resident.approvalStatus !== "PENDING" || loading}
                          className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(resident.id, "reject")}
                          disabled={resident.approvalStatus !== "PENDING" || loading}
                          className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Resident Details Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl transition-all">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Edit Resident Details</h3>
                <p className="mt-1.5 text-xs text-slate-500">Modify the flat owner's registration details below.</p>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={editForm.mobile}
                    onChange={(e) => setEditForm(prev => ({ ...prev, mobile: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                {/* Occupant Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Occupant Type</label>
                  <select
                    value={editForm.occupantType}
                    onChange={(e) => setEditForm(prev => ({ ...prev, occupantType: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    <option value="OWNER">Owner</option>
                    <option value="TENANT">Tenant</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Block Select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Block</label>
                    <select
                      value={editForm.blockId}
                      onChange={handleBlockChange}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none"
                    >
                      <option value="">Select Block</option>
                      {blocks.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Flat Select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Flat</label>
                    <select
                      value={editForm.flatId}
                      disabled={!editForm.blockId}
                      onChange={(e) => setEditForm(prev => ({ ...prev, flatId: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none disabled:bg-slate-50"
                    >
                      <option value="">Select Flat</option>
                      {flats.map(f => (
                        <option key={f.id} value={f.id}>{f.flatNumber} ({f.bhkType})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingResident(null);
                    }}
                    className="w-1/2 rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-1/2 rounded-full bg-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-violet-100 hover:bg-violet-750 disabled:opacity-50 transition"
                  >
                    {loading ? "Saving..." : "Save Details"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
