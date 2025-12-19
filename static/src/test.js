
<DatePicker
ref={ref}
format="DD/MM/YYYY hh:mm A"
onChange={(date, dateString) => console.log(date, dateString)}
showTime={{ use12Hours: true }}
/>