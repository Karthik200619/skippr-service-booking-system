import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';

function AdminBlocks() {
  const [blocks, setBlocks] = useState([]);
  const [flats, setFlats] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
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

  const loadFlats = async () => {
    try {
      const res = await axios.get("/admin-api/flats");
      setFlats(res.data.payload.flats || []);
    } catch (err) {
      console.error("Error loading flats:", err);
    }
  };

  const loadBlocks = async () => {
    setFetching(true);
    try {
      const res = await axios.get("/admin-api/blocks");
      setBlocks(res.data.payload.blocks || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load blocks");
    } finally {
      setFetching(false);
    }
  };

  const createBlock = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("/admin-api/block", data);
      showMessage("Block created successfully.");
      reset();
      loadBlocks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create block");
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
        {/* Create Block Form */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.35)] h-fit">
          <h2 className="text-xl font-semibold text-slate-900">Create New Block</h2>
          <p className="mt-2 text-sm text-slate-500">Add a residential block and its base metadata.</p>
          
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(createBlock)}>
            <label className="block text-sm text-slate-700 font-medium">
              Block Name
              <input
                type="text"
                placeholder="Example: Rose Tower"
                className="mt-2 w-full rounded-3xl border border-slate-350 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                {...register("name", { required: "Block name is required" })}
              />
              {errors.name && <span className="mt-2 block text-sm text-rose-600 font-normal">{errors.name.message}</span>}
            </label>

            <label className="block text-sm text-slate-700 font-medium">
              Total Floors
              <input
                type="number"
                min="1"
                placeholder="Example: 5"
                className="mt-2 w-full rounded-3xl border border-slate-350 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                {...register("totalFloors", { required: "Total floors is required" })}
              />
              {errors.totalFloors && <span className="mt-2 block text-sm text-rose-600 font-normal">{errors.totalFloors.message}</span>}
            </label>

            <label className="block text-sm text-slate-700 font-medium">
              Description
              <textarea
                rows="4"
                className="mt-2 w-full rounded-3xl border border-slate-350 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                placeholder="Add a short description for this block"
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && <span className="mt-2 block text-sm text-rose-600 font-normal">{errors.description.message}</span>}
            </label>

            <button type="submit" disabled={loading} className="mt-2 inline-flex w-full justify-center rounded-3xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-55">
              {loading ? "Saving block..." : "Create Block"}
            </button>
          </form>
        </div>

        {/* Blocks List */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.35)]">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Blocks</h2>
              <p className="mt-1 text-sm text-slate-500">Manage the blocks you created and inspect their details.</p>
            </div>
            <button onClick={() => { loadBlocks(); loadFlats(); }} className="text-xs font-semibold text-violet-600 hover:text-violet-750">
              🔄 Refresh
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {fetching ? (
              <p className="text-sm text-slate-500 py-4">Loading blocks list...</p>
            ) : blocks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">No blocks available.</div>
            ) : (
              blocks.map((block) => {
                const blockFlats = flats.filter(flat => String(flat.blockId) === String(block.id));
                const isSelected = selectedBlockId === block.id;

                return (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(isSelected ? null : block.id)}
                    className={`rounded-3xl border p-4 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-violet-500 bg-violet-50/20 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-slate-100/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🏢</span>
                        <h3 className="text-base font-semibold text-slate-900">{block.name}</h3>
                      </div>
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">{block.totalFloors} floors</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{block.description}</p>

                    {isSelected && (
                      <div className="mt-4 border-t border-slate-200 pt-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Flats in Block ({blockFlats.length})</h4>
                          <span className="text-[10px] text-slate-400 font-semibold">Click block to collapse</span>
                        </div>
                        {blockFlats.length === 0 ? (
                          <p className="text-xs text-slate-500 italic bg-white rounded-2xl p-3 border border-slate-150">No flats registered in this block yet.</p>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {blockFlats.map(flat => (
                              <div
                                key={flat.id}
                                className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm text-left hover:border-violet-400 transition"
                              >
                                <div className="font-bold text-slate-950 text-xs">Flat {flat.flatNumber}</div>
                                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{flat.bhkType}</div>
                                <div className="text-[9px] text-slate-400 mt-0.5">Floor {flat.floor} • Park: {flat.parkingSlot || "-"}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBlocks;
