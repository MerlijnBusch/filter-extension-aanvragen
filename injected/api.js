function buildDemandUrl(division, minGrade, maxGrade, pageNumber, itemsPerPage) {
  const baseUrl = CONFIG.BASE_URL;

  const gradeOrder = ["A", "B", "C", "D"];
  const minIndex = gradeOrder.indexOf(minGrade);
  const maxIndex = gradeOrder.indexOf(maxGrade);
  const grades = minIndex <= maxIndex
    ? gradeOrder.slice(minIndex, maxIndex + 1)
    : gradeOrder.slice(maxIndex, minIndex + 1);

  const sorting = [
    "offerStatus asc", "mabSent asc ", "demandDate desc", "demandNumber desc", "role desc", "customer desc",
    "workingLocation desc", "grade desc", "startDate desc", "dlcCode desc",
  ];

  const params = new URLSearchParams();
  params.append("Divisions", division);
  grades.forEach(grade => params.append("Grades", grade));
  params.append("PageNumber", 1);
  params.append("ItemsPerPage", 200);
  params.append("Sorting", sorting.join(','));

  return `${baseUrl}?${params.toString()}`;
}
