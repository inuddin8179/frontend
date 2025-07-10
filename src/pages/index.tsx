import { useEffect, useState } from "react";
import axios from "axios";
type User = {
  _id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  gender: string;
};
type UserForm = Omit<User, "_id">;
export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<UserForm>({
    firstName: "",
    lastName: "",
    jobTitle: "",
    gender: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    const res = await axios.get<User[]>("http://localhost:8000/api/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editingId) {
      await axios.patch(`http://localhost:8000/api/users/${editingId}`, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        jobTitle: form.jobTitle.trim(),
        gender: form.gender.trim(),
      });
      setEditingId(null);
    } else {
      await axios.post("http://localhost:8000/api/users", form);
    }

    setForm({
      firstName: "",
      lastName: "",
      jobTitle: "",
      gender: "",
    });
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      jobTitle: user.jobTitle,
      gender: user.gender,
    });
    setEditingId(user._id);
  };

  const handleDelete = async (id: string) => {
  await axios.delete(`http://localhost:8000/api/users/${id}`);
  if (editingId === id) {
    setEditingId(null);
    setForm({
      firstName: "",
      lastName: "",
      jobTitle: "",
      gender: "",
    });
  }

  fetchUsers();
};

  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div style={{width:"40%"}}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxWidth: "100%",
            backgroundColor: "#fefefe",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "10px",
              color: "#2b6cb0",
            }}
          >
            {editingId ? "Edit User" : "Add New User"}
          </h2>

          {["firstName", "lastName", "jobTitle", "gender"].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              value={(form as any)[field]}
              onChange={handleChange}
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #cbd5e0",
                fontSize: "14px",
                outlineColor: "#3182ce",
              }}
            />
          ))}

          <button
            onClick={handleSubmit}
            disabled={
              !form.firstName.trim() ||
              !form.lastName.trim() ||
              !form.jobTitle?.trim() ||
              !form.gender?.trim()
            }
            style={{
              padding: "12px",
              opacity:
                !form.firstName.trim() ||
                !form.lastName.trim() ||
                !form.jobTitle?.trim() ||
                !form.gender?.trim()
                  ? 0.2
                  : 1,
              backgroundColor: editingId ? "#ecc94b" : "#48bb78",
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
              transition: "all 0.2s",
            }}
          >
            {editingId ? "Update User" : "Add User"}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "16px",
          width: "40%",
        }}
      >
        {users.map((user) => (
          <div
            key={user._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              backgroundColor: "#f7fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: "bold", color: "#2d3748" }}>
                {user.firstName} {user.lastName}
              </p>
              <p style={{ margin: "4px 0", color: "#4a5568" }}>
                <strong>Gender:</strong> {user.gender} &nbsp;|&nbsp;
                <strong>Job:</strong> {user.jobTitle}
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleEdit(user)}
                style={{
                  backgroundColor: "#3182ce",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                style={{
                  backgroundColor: "#e53e3e",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
