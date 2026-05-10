document.addEventListener('DOMContentLoaded', () => {
    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();
    
    // DOM Elements
    const form = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalAmountEl = document.getElementById('total-amount');
    const healthStatusEl = document.getElementById('health-status');
    const pulseDot = healthStatusEl.querySelector('.pulse-dot');
    
    // Check Health API
    async function checkHealth() {
        try {
            const res = await fetch('/health');
            if (res.ok) {
                pulseDot.classList.add('online');
                healthStatusEl.title = 'Status API: Online';
            } else {
                pulseDot.classList.remove('online');
                healthStatusEl.title = 'Status API: Offline';
            }
        } catch (error) {
            pulseDot.classList.remove('online');
            healthStatusEl.title = 'Status API: Error';
        }
    }
    
    // Format currency (IDR)
    function formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // Format date
    function formatDate(dateStr) {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateStr).toLocaleDateString('id-ID', options);
    }
    
    // Fetch and display expenses
    async function fetchExpenses() {
        try {
            const res = await fetch('/api/expenses');
            const data = await res.json();
            
            expenseList.innerHTML = '';
            
            if (data.length === 0) {
                expenseList.innerHTML = '<div class="empty-state">Belum ada data pengeluaran.</div>';
                totalAmountEl.textContent = 'Rp 0';
                return;
            }
            
            let total = 0;
            
            data.forEach((expense, index) => {
                total += expense.amount;
                
                const item = document.createElement('div');
                item.className = 'expense-item';
                item.style.animationDelay = `${index * 0.1}s`;
                
                item.innerHTML = `
                    <div class="expense-info">
                        <h4>${expense.title}</h4>
                        <div class="expense-meta">
                            <span>${formatDate(expense.date)}</span>
                            <span>•</span>
                            <span>${expense.category}</span>
                        </div>
                    </div>
                    <div class="expense-amount-action">
                        <div class="expense-amount">${formatCurrency(expense.amount)}</div>
                        <button class="btn-delete" data-id="${expense.id}" title="Hapus">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                `;
                
                expenseList.appendChild(item);
            });
            
            totalAmountEl.textContent = formatCurrency(total);
            
            // Add delete listeners
            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    await deleteExpense(id);
                });
            });
            
        } catch (error) {
            console.error('Error fetching expenses:', error);
            expenseList.innerHTML = '<div class="empty-state">Gagal memuat data.</div>';
        }
    }
    
    // Add new expense
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const amount = document.getElementById('amount').value;
        const date = document.getElementById('date').value;
        const category = document.getElementById('category').value;
        
        try {
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    amount: parseFloat(amount),
                    date,
                    category
                })
            });
            
            if (res.ok) {
                form.reset();
                document.getElementById('date').valueAsDate = new Date();
                fetchExpenses();
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            alert('Gagal menambahkan pengeluaran.');
        }
    });
    
    // Delete expense
    async function deleteExpense(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) return;
        
        try {
            const res = await fetch(`/api/expenses/${id}`, {
                method: 'DELETE'
            });
            
            if (res.ok) {
                fetchExpenses();
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            alert('Gagal menghapus pengeluaran.');
        }
    }
    
    // Initial calls
    checkHealth();
    fetchExpenses();
});
