
function parseAllData(all_data) {
  try {
    return JSON.parse(all_data);
  } catch {
    return {};
  }
}
function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(Number(hours), Number(minutes));
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
function formatDate(dateString) {
  if (!dateString) return '';
  const datePart = dateString.split('T')[0]; // "2026-06-19" -- strips the time/Z part
  const [year, month, day] = datePart.split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day)); // constructs LOCAL date, no UTC shift
  return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
}


export default function OpenHouses({ openHouses }) {
  if (!openHouses || openHouses.length === 0) {
    return <p>No open houses scheduled</p>;
  }
  return(
    <ul className="open-houses-list">
        {openHouses.map((oh)=>{
             const data = parseAllData(oh.all_data);
             const remarks = data.OpenHouseRemarks;

             return(
                 <li key={oh.id} className="open-house-item">
                    <p className="open-house-date">{formatDate(oh.OpenHouseDate)}</p>
                    <p className="open-house-time">
                        {formatTime(oh.OH_StartTime)} - {formatTime(oh.OH_EndTime)}
                    </p>
                    {remarks && <p className="open-house-remarks">{remarks}</p>}
                 </li>
             )
             

        })}
       
    </ul>
  )
}