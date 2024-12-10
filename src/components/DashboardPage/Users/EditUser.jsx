import { Modal } from "@/components/utils/Modal";
import React from "react";
import Profile from "../Profile/Profile";

export default function EditUser({ onClose, data }) {
  return (
    <Modal title={"Update user profile"} onClose={onClose}>
      <Profile onClose={onClose} data={data} />
    </Modal>
  );
}
