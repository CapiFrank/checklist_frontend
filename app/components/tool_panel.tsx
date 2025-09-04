import {
  faFloppyDisk,
  faNoteSticky,
  faStar,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "./primary_button";
import InputLabel from "./input_label";
import TextArea from "./text_area";
import TextInput from "./text_input";
import { useTasks } from "~/contexts/task_context";
import { useEffect, useState, type FormEventHandler } from "react";
import Swal from "sweetalert2";

const ToolPanel = () => {
  const { selectedTask, upsertTask, selectedPageId } = useTasks();
  const [title, setTitle] = useState(selectedTask?.title ?? "");
  const [note, setNote] = useState(selectedTask?.note ?? "");
  const [date, setDate] = useState(selectedTask?.date ?? null);
  const [isMyDay, setIsMyDay] = useState(selectedTask?.is_my_day ?? false);
  const [isImportant, setIsImportant] = useState(
    selectedTask?.is_important ?? false
  );

  // Cuando cambia la selección, sincronizamos el form
  useEffect(() => {
    setTitle(selectedTask?.title ?? "");
    setNote(selectedTask?.note ?? "");
    setDate(selectedTask?.date ?? null);
    setIsMyDay(selectedTask?.is_my_day ?? false);
    setIsImportant(selectedTask?.is_important ?? false);
  }, [selectedTask]);

  const resetForm = () => {
    setTitle("");
    setNote("");
    setDate(null);
    setIsMyDay(false);
    setIsImportant(false);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const task = {
      ...selectedTask,
      id: selectedTask?.id ?? null,
      title,
      note,
      date,
      is_important: isImportant,
      is_my_day: isMyDay,
      is_scheduled: !!date,
      page_id: selectedPageId ?? null,
    };

    upsertTask(task);
    resetForm();
  };

  return (
    <form
      className="h-full w-full flex flex-col gap-4 p-4"
      onSubmit={handleSubmit}
    >
      <div>
        <InputLabel htmlFor="title">Titulo:</InputLabel>
        <TextInput
          id="title"
          className="bg-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        ></TextInput>
      </div>
      <div>
        <InputLabel htmlFor="note">Nota:</InputLabel>
        <TextArea
          id="note"
          className="bg-white"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
        ></TextArea>
      </div>
      <div>
        <InputLabel htmlFor="date">Fecha:</InputLabel>
        <TextInput
          id="date"
          type="date"
          className="bg-white"
          value={date ? new Date(date).toISOString().split("T")[0] : ""}
          onChange={(e) => {
            const value = e.target.value;
            setDate(value ? new Date(value) : null); // si está vacío, guardamos null
          }}
        ></TextInput>
      </div>
      <PrimaryButton
        className={`flex gap-2`}
        color={`${isMyDay ? "bg-slate-600 hover:bg-slate-500 active:bg-slate-700 focus:bg-slate-500 focus:ring-slate-500" : ""}`}
        type="button"
        onClick={() => setIsMyDay(!isMyDay)}
      >
        <FontAwesomeIcon icon={faSun} />
        Mi Día
      </PrimaryButton>
      <PrimaryButton
        className={`flex gap-2`}
        color={`${isImportant ? "bg-slate-600 hover:bg-slate-500 active:bg-slate-700 focus:bg-slate-500 focus:ring-slate-500" : ""}`}
        type="button"
        onClick={() => setIsImportant(!isImportant)}
      >
        <FontAwesomeIcon icon={faStar} />
        Importante
      </PrimaryButton>
      <PrimaryButton className="flex gap-2">
        <FontAwesomeIcon icon={faFloppyDisk} />
        Guardar
      </PrimaryButton>
    </form>
  );
};

export default ToolPanel;
