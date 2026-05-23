document.addEventListener('DOMContentLoaded', () => {
  const complaintItems = document.querySelectorAll('.complaint-item');
  const statusSelect = document.getElementById('statusFilter');
  const locationSelect = document.getElementById('locationFilter');
  const severitySelect = document.getElementById('severityFilter');
  const dateSelect = document.getElementById('dateFilter');

  function applyFilters() {
    const stat = statusSelect.value;
    const loc = locationSelect.value;
    const sev = severitySelect.value;
    const dateVal = dateSelect ? dateSelect.value : 'all';
    let visibleCount = 0;

    // AntiGravity Integration: In a real environment, you might filter the JSON data model 
    // instead of DOM nodes and let the framework re-render the list components.
    complaintItems.forEach(item => {
      const itemStatus = item.getAttribute('data-status');
      const itemLoc = item.getAttribute('data-location');
      const itemSev = item.getAttribute('data-severity');
      
      // Using 'data-date' as age in days for demonstration
      const itemDateDays = parseInt(item.getAttribute('data-date') || '0', 10);

      const matchStatus = (stat === 'all' || itemStatus === stat);
      const matchLoc = (loc === 'all' || itemLoc === loc);
      const matchSev = (sev === 'all' || itemSev === sev);
      
      let matchDate = true;
      if (dateVal === 'today') {
        matchDate = (itemDateDays === 0);
      } else if (dateVal === 'week') {
        matchDate = (itemDateDays <= 7);
      } else if (dateVal === 'month') {
        matchDate = (itemDateDays <= 30);
      }

      if (matchStatus && matchLoc && matchSev && matchDate) {
        item.style.display = 'flex';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    const noRecordsMsg = document.getElementById('noRecordsMessage');
    if (visibleCount === 0) {
      noRecordsMsg.style.display = 'block';
    } else {
      noRecordsMsg.style.display = 'none';
    }
  }

  // AntiGravity Integration: Bind these onChange handlers dynamically to component states
  statusSelect.addEventListener('change', applyFilters);
  locationSelect.addEventListener('change', applyFilters);
  severitySelect.addEventListener('change', applyFilters);
  if (dateSelect) dateSelect.addEventListener('change', applyFilters);
});
