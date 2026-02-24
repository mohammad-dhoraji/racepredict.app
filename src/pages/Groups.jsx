import React, { useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const Groups = () => {
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Ferrari Fans",
      inviteCode: "FERRARI24",
      membersCount: 6,
      leaderboard: [
        {
          userId: 1,
          username: "SpeedKing",
          totalPoints: 210,
          lastRacePoints: 25,
        },
      ],
    },
  ]);

  const [joinCode, setJoinCode] = useState("");
  const [newGroupName, setNewGroupName] = useState("");

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;

    const newGroup = {
      id: Date.now(),
      name: newGroupName,
      members: 1,
      leaderboard: [],
    };

    setGroups([...groups, newGroup]);
    setNewGroupName("");
  };

  const handleJoinGroup = () => {
    if (!joinCode.trim()) return;

    alert(`Joining group with code: ${joinCode}`);
    setJoinCode("");
  };
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-6 py-10 w-full">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-14">
            <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">Groups</h1>
            <p className="text-zinc-400">
              Compete privately with friends. Create or join a group.
            </p>
          </div>

          {/* Create + Join Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-14">
            {/* Create Group */}
            <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
              <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
              <h2 className="text-2xl font-semibold mb-8 tracking-wide">Create Group</h2>
              <input
                type="text"
                placeholder="Enter group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 mb-6 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#c1a362]"
              />
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </div>

            {/* Join Group */}
            <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
              <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
              <h2 className="text-2xl font-semibold mb-8 tracking-wide">Join Group</h2>
              <input
                type="text"
                placeholder="Enter invite code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 mb-6 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#c1a362]"
              />
              <Button onClick={handleJoinGroup}>Join Group</Button>
            </div>
          </div>

          {/* User Groups List */}
          <div>
            <h2 className="text-2xl font-semibold mb-8 tracking-wide">Your Groups</h2>

            {groups.length === 0 ? (
              <p className="text-zinc-500">
                You are not part of any group yet.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-8 shadow-2xl shadow-black/40 hover:border-zinc-700 transition-all"
                  >
                    <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold">{group.name}</h3>
                      <span className="text-sm text-zinc-400 bg-zinc-800/50 px-3 py-1 rounded-full">
                        {group.members} members
                      </span>
                    </div>

                    {/* Mini Leaderboard */}
                    <div className="space-y-2 mb-8">
                      {group.leaderboard.length === 0 ? (
                        <p className="text-zinc-500 text-sm">No scores yet.</p>
                      ) : (
                        [...group.leaderboard]
                          .sort((a, b) => b.totalPoints - a.totalPoints)
                          .map((user, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                #{index + 1} {user.name}
                              </span>
                              <span>{user.points} pts</span>
                            </div>
                          ))
                      )}
                    </div>

                    <Button onClick={() => navigate(`/groups/${group.id}`)}>
                      View Group
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Groups;
