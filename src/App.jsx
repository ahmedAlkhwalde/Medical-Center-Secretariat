// import "./App.css";

// function App() {
//   return(
//     <div className="App"> 
//         hello
//     </div>
//   );
// }

// export default App;


import MasterSchedule from "./pages/MasterSchedule";

function App() {
  return (
    <div className="App">
      {/* يمكنك إضافة الـ Sidebar هنا لاحقاً ليبقى ثابتاً */}
      <MasterSchedule />
    </div>
  );
}

export default App;