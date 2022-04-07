import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../constants/styles';
import { storeExpense, updateExpense, deleteExpense } from '../util/http';
import { ExpensesContext } from '../store/expenses-context';

function ManageExpense({ route, navigation }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();
    const expensesCtx = useContext(ExpensesContext);

    const editedExpenseId = route.params?.expenseId;
    const isEditing = !!editedExpenseId;

    const selectedExpense = expensesCtx.expenses.find(
        (expense) => expense.id === editedExpenseId
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Expense' : 'Add Expense',
        });
    }, [navigation, isEditing]);
    function errorHandler() {
        setError(null);
    }
    async function deleteExpenseHandler() {
        setIsSubmitting(true);
        try {
            expensesCtx.deleteExpense(editedExpenseId);
            await deleteExpense(editedExpenseId);
            navigation.goBack();
        } catch (error) {
            setError('Delete failed, try again later');
            setIsSubmitting(false);
        }
    }

    function cancelHandler() {
        navigation.goBack();
    }

    async function confirmHandler(expenseData) {
        setIsSubmitting(true);
        try {
            if (isEditing) {
                expensesCtx.updateExpense(editedExpenseId, expenseData);
                updateExpense(editedExpenseId, expenseData);
            } else {
                const id = await storeExpense(expenseData);
                expensesCtx.addExpense({ ...expenseData, id: id });
            }
            navigation.goBack();
        } catch (error) {
            setError('Action failed, try again later');
            setIsSubmitting(false);
        }
        setIsSubmitting(false);
    }
    if (error && !isSubmitting) {
        return <ErrorOverlay message={error} onConfirm={errorHandler} />;
    }
    if (isSubmitting) {
        return <LoadingOverlay />;
    }
    return (
        <View style={styles.container}>
            <ExpenseForm
                submitButtonLabel={isEditing ? 'Update' : 'Add'}
                onSubmit={confirmHandler}
                onCancel={cancelHandler}
                defaultValues={selectedExpense}
            />
            {isEditing && (
                <View style={styles.deleteContainer}>
                    <IconButton
                        icon='trash'
                        color={GlobalStyles.colors.error500}
                        size={36}
                        onPress={deleteExpenseHandler}
                    />
                </View>
            )}
        </View>
    );
}

export default ManageExpense;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800,
    },
    deleteContainer: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 2,
        borderTopColor: GlobalStyles.colors.primary200,
        alignItems: 'center',
    },
});
