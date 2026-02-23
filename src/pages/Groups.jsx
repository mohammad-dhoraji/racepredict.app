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
      <div className="min-h-screen bg-neutral-800 text-white px-6 py-10 w-full">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2">Groups</h1>
            <p className="text-zinc-400">
              Compete privately with friends. Create or join a group.
            </p>
          </div>

          {/* Create + Join Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Create Group */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Create Group</h2>
              <input
                type="text"
                placeholder="Enter group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-[#c1a362]"
              />
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </div>

            {/* Join Group */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Join Group</h2>
              <input
                type="text"
                placeholder="Enter invite code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-[#c1a362]"
              />
              <Button onClick={handleJoinGroup}>Join Group</Button>
            </div>
          </div>

          {/* User Groups List */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Your Groups</h2>

            {groups.length === 0 ? (
              <p className="text-zinc-500">
                You are not part of any group yet.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-[#c1a362] transition-all"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">{group.name}</h3>
                      <span className="text-sm text-zinc-400">
                        {group.members} members
                      </span>
                    </div>

                    {/* Mini Leaderboard */}
                    <div className="space-y-2 mb-4">
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
