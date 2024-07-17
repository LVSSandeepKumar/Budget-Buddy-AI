"use client"
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import { db } from '../../../../utils/dbConfig';
import { Budgets, Expenses } from '../../../../utils/schema';
import ExpenseListTable from '@/components/ExpenseListTable';

function ExpensesScreen() {

  const [expensesList,setExpensesList]=useState([]);
    const {user}=useUser();

    useEffect(()=>{
        user&&getAllExpenses();
      },[user])
    /**
   * Used to get All expenses belong to users
   */
  const getAllExpenses=async()=>{
    const result=await db.select({
      id:Expenses.id,
      name:Expenses.name,
      amount:Expenses.amount,
      createdAt:Expenses.createdAt
    }).from(Budgets)
    .rightJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
    .where(eq(Budgets.createdBy,user?.primaryEmailAddress.emailAddress))
    .orderBy(desc(Expenses.id));
    setExpensesList(result);
   
  }
  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl'>My Expenses</h2>

        <ExpenseListTable refreshData={()=>getAllExpenses()}
        expensesList={expensesList}
        />
    </div>
  )
}

export default ExpensesScreen