document.addEventListener('DOMContentLoaded', () => {
    player='X';
    const resetButton = document.getElementById('reset');
    const cells = document.querySelectorAll('.cell');
    game= [
        ['', '', ''], 
        ['', '', ''], 
        ['', '', '']]

    const takeTurn = (event) => {
        const selectedCell = event.target;
        const selectedCellIndex = parseInt(selectedCell.getAttribute('data-cell-index'));
    
    }
});