import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';

function AdminFlats() {
  const [blocks, setBlocks] = useState([]);
  const [flats, setFlats] = useState([]);
  const [blockFilter, setBlockFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    loadBlocks();
    loadFlats();
  }, []);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 4000);
  };

  const loadBlocks = async () => {
    try {
      const res = await axios.get("/admin-api/blocks");
      setBlocks(res.data.payload.blocks || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load blocks");
    }
  };

  const loadFlats = async () => {
    setFetching(true);
    try {
      const res = await axios.get("/admin-api/flats");
      setFlats(res.data.payload.flats || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load flats");
    } finally {
      setFetching(false);
    }
  };

  const createFlat = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("/admin-api/flat", data);
      showMessage("Flat created successfully.");
      reset();
      loadFlats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create flat");
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create Flat Form */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.35)] h-fit">
          <h2 className="text-xl font-semibold text-slate-900">Create New Flat</h2>
          <p className="mt-2 text-sm text-slate-500">Add flat details and assign it to an existing block.</p>
          
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(createFlat)}>
            <label className="block text-sm text-slate-700 font-medium">
              Block
              <select
                className="mt-2 w-full rounded-3xl border border-slate-350 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                {...register("blockId", { required: "Select a block" })}
              >
                <option value="">Select block</option>
                {blocks.map((block) => (
                  <option key={block.id} value={block.id}>{block.name}</option>
                ))}
              </select>
              {errors.blockId && <span className="mt-2 block text-sm text-rose-600 font-normal">{errors.blockId.message}</span>}
            </label>

            <label className="block text-sm text-slate-700 font-medium">
              Flat Number
              <input
                type="text"
                placeholder="101"
                className="mt-2 w-full rounded-3xl border border-slate-350 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                {...register("flatNumber", { required: "Flat number is required" })}
              />
              {errors.flatNumber && <span className="mt-2 block text-sm text-rose-600 font-normal">{errors.flatNumber.message}</span>}
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-700 font-medium">
                Floor
                <input
                  type="number"
                  min="1"
                  placeholder="2"
                  className="mt-2 w-full rounded-3xl border border-slate-350 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  {...register("floor", { required: "Floor is required" })}
                />
                {errors.floor && <span className="mt-2 block text-sm text-rose-600 font-normal">{errors.floor.message}</span>}
              </label>

              <label className="block text-sm text-slate-700 font-medium">
                Parking Slot
                <input
                  type="text"
                  placeholder="P-12"
                  className="mt-2 w-full rounded-3xl border border-slate-350 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  {...register("parkingSlot", { required: "Parking slot is required" })}
                />
                {errors.parkingSlot && <span className="mt-2 block text-sm text-rose-600 font-normal">{errors.parkingSlot.message}</span>}
              </label>
            </div>

            <label className="block text-sm text-slate-700 font-medium">
              BHK Type
              <select
                className="mt-2 w-full rounded-3xl border border-slate-350 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                {...register("bhkType", { required: "Select BHK type" })}
              >
                <option value="">Select type</option>
                <option value="1BHK">1 BHK</option>
                <option value="2BHK">2 BHK</option>
                <option value="3BHK">3 BHK</option>
                <option value="4BHK">4 BHK</option>
              </select>
              {errors.bhkType && <span className="mt-2 block text-sm text-rose-600 font-normal">{errors.bhkType.message}</span>}
            </label>

            <button type="submit" disabled={loading} className="mt-2 inline-flex w-full justify-center rounded-3xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-55">
              {loading ? "Saving flat..." : "Create Flat"}
            </button>
          </form>
        </div>

        {/* Flats List */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Flats</h2>
              <p className="mt-1 text-sm text-slate-500">Review the flats assigned to each block.</p>
              
              {/* Block Filter Dropdown */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Filter Block:</span>
                <select
                  value={blockFilter}
                  onChange={(e) => setBlockFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium focus:border-violet-500 focus:outline-none"
                >
                  <option value="ALL">All Blocks</option>
                  {blocks.map((b) => (
                    <option key={b.id} value={b.id}>Block {b.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button onClick={loadFlats} className="text-xs font-semibold text-violet-600 hover:text-violet-750 self-start sm:self-center">
              🔄 Refresh
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {fetching ? (
              <p className="text-sm text-slate-500 py-4">Loading flats list...</p>
            ) : flats.filter(f => blockFilter === "ALL" || String(f.blockId) === String(blockFilter)).length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">No flats found matching selected block.</div>
            ) : (
              flats
                .filter((flat) => blockFilter === "ALL" || String(flat.blockId) === String(blockFilter))
                .map((flat) => (
                  <div key={flat.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 cursor-pointer hover:border-violet-500 hover:bg-violet-50/20 transition-all duration-200">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{flat.flatNumber} — {flat.bhkType}</h3>
                        <p className="mt-1 text-sm text-slate-650">Block: {flat.block?.name ?? flat.blockId}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-slate-700">
                        <span className="rounded-full bg-white px-3 py-1 shadow-sm">Floor {flat.floor}</span>
                        <span className="rounded-full bg-white px-3 py-1 shadow-sm">Parking {flat.parkingSlot || "-"}</span>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminFlats;
