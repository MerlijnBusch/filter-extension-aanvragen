function buildDemandUrl(division, minGrade, maxGrade, pageNumber, itemsPerPage) {
    const baseUrl = CONFIG.BASE_URL;

    const gradeOrder = ["A", "B", "C", "D"];
    const minIndex = gradeOrder.indexOf(minGrade);
    const maxIndex = gradeOrder.indexOf(maxGrade);
    const grades = minIndex <= maxIndex
        ? gradeOrder.slice(minIndex, maxIndex + 1)
        : gradeOrder.slice(maxIndex, minIndex + 1);

    const sorting = [
        "demandDate desc", "demandNumber desc", "role desc", "customer desc",
        "workingLocation desc", "grade desc", "startDate desc", "dlcCode desc",
        "offerStatus desc", "mabSent desc",
    ];

    const params = new URLSearchParams({
        Divisions: division,
        PageNumber: 1,
        ItemsPerPage: 200,
        Sorting: sorting.join(','),
    });
    grades.forEach(grade => params.append("Grades", grade));

    return `${baseUrl}?${params.toString()}`;
}
