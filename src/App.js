import React, { useState, useEffect } from 'react';
import './App.css';
import Preview from "./components/preview";
import Message from "./components/Message";
import NotesContainer from "./components/notes/NotesContainer";
import NotesList from "./components/notes/NotesList";
import Note from "./components/notes/Note";
import NotesForm from "./components/notes/NotesForm";
import Alert from "./components/Alert";

function App() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectednote, setselectedNote] = useState(null);
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);

    useEffect(() => {
        if (localStorage.getItem('notes')) {
            setNotes(JSON.parse(localStorage.getItem('notes')));
        }
        else {
            localStorage.setItem('notes', JSON.stringify([]));
        }
    }, []);
    //ازالة مسج الخطا بعد 3 ثوان
    useEffect(() => {
        if (validationErrors.length !== 0) {
            setTimeout(() => {
                setValidationErrors([]);

            }, 3000)
        }
    }, [validationErrors]);

    // تنبيه في حال لم ادخل معلومات 
    const validate = () => {
        const validationErrors = [];
        let passed = true;
        if (!title) {
            validationErrors.push("الرجاء ادخال عنوان الملاحظة");
            passed = false;
        }
        if (!content) {
            validationErrors.push("الرجاء ادخال نص الملاحظة");
            passed = false;
        }
        setValidationErrors(validationErrors);
        return passed;
    }
  
  
    // حفظ ع الذاكره المحليه في المتضفح
    const saveToLocalStorage = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    }

    const saveNoteHandler = () => {
        if (!validate()) return;

        const note = {
            id: new Date(),
            title: title,
            content: content
        }

        const updateNotes = [...notes, note];
        saveToLocalStorage("notes", updateNotes);
        setNotes(updateNotes);
        setCreating(false);
        setselectedNote(note.id);
        setTitle('');
        setContent('');
    }
    //تفيير عنوان الملاحظة
    const changeTitleHander = (event) => {
        setTitle(event.target.value)
    }

    //تفيير نص الملاحظة
    const changeContentHander = (event) => {
        setContent(event.target.value);
    }

    //اختيار الملاحظه
    const selectNoteHandler = noteId => {
        setselectedNote(noteId);
        setCreating(false);
        setEditing(false);
    }

    // الانتقال الى وضع تعديل الملاحظه
    const editNoteHandler = () => {
        const note = notes.find(note => note.id === selectednote);
        setEditing(true);
        setTitle(note.title);
        setContent(note.content);
    }
    // تعديل الملاحظه وحفضها
    const updateNoteHandler = () => {
        if (!validate()) return;

        const updateNotes = [...notes];
        const noteIndex = notes.findIndex(note => note.id === selectednote);
        updateNotes[noteIndex] = {
            id: selectednote,
            title: title,
            content: content
        };
        saveToLocalStorage("notes", updateNotes);
        setNotes(updateNotes);
        setEditing(false);
        setTitle('');
        setContent('');
    }

    //الانتقال الى واجهة اضافه الملاحظه

    const addNoteHandler = () => {
        setCreating(true);
        setEditing(false);
        setContent('');
        setTitle('');
    }
    //حذف الملاحظه
    const deleteNoteHnader = () => {

        const updateNotes = [...notes];
        const noteIndex = updateNotes.findIndex(note => note.id === selectednote);
        notes.splice(noteIndex, 1);
        saveToLocalStorage("notes", notes);
        setNotes(notes);
        setselectedNote(null)

    }
    const getAddNote = () => {
        return (
            <NotesForm
                formTitle="ملاحظة جديدة"
                title={title}
                content={content}
                titleChanged={changeTitleHander}
                contentChanged={changeContentHander}
                submitText="حفظ"
                submitClicked={saveNoteHandler}
            />
        );
    }

    const getPreview = () => {
        if (notes.length === 0) {
            return <Message title="لا يوجد ملاحظة" />
        }
        if (!selectednote) {
            return <Message title="الرجاء اختيار الملاحظة" />
        }

        const note = notes.find(note => {
            return note.id === selectednote;
        });

        let notedisplay = (
            <div>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
            </div>
        )
        if (editing) {
            notedisplay = (
                <NotesForm
                    formTitle="تعديل الملاحظة"
                    title={title}
                    content={content}
                    titleChanged={changeTitleHander}
                    contentChanged={changeContentHander}
                    submitText="تعديل"
                    submitClicked={updateNoteHandler}
                />
            );
        }
        return (
            <div>
                {!editing &&
                    <div className="note-operations">
                        <a href="#" onClick={editNoteHandler}><i className="fa fa-pencil-alt" /></a>
                        <a href="#" onClick={deleteNoteHnader}><i className="fa fa-trash" /></a>
                    </div>
                }

                {notedisplay}
            </div>
        );
    };

    return (
        <div className="App">
            <NotesContainer>
                <NotesList>
                    {notes.map(note =>
                        <Note
                            key={note.id}
                            title={note.title}
                            noteClicked={() => selectNoteHandler(note.id)}
                            active={selectednote === note.id}
                        />)}
                </NotesList>
                <button className="add-btn" onClick={addNoteHandler}>
                    +
                    </button>
            </NotesContainer>
            <Preview>
                {creating ? getAddNote() : getPreview()}
            </Preview>
            {validationErrors.length !== 0 && <Alert validationMessages={validationErrors} />}
           
        </div>
    );
}

export default App;
