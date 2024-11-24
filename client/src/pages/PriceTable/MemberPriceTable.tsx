import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import DataTable from "../../components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/20/solid";

// GraphQL query to fetch all prices
const GET_ALL_PRICES = gql`
  query getAllMemberPriceTable {
    getAllMemberPriceTable {
      id
      description
      ageGroup
      customerType
      shift
      monthQty
      price
      entryQty
    }
  }
`;

// GraphQL mutation to update a member price
const UPDATE_MEMBER_PRICE = gql`
    mutation UpdatePrice($updatePriceId: Int!, $description: String, $ageGroup: String, $customerType: String, $shift: String, $monthQty: Float, $price: Float, $entryQty: Float) {
        updatePrice(id: $updatePriceId, description: $description, ageGroup: $ageGroup, customerType: $customerType, shift: $shift, monthQty: $monthQty, price: $price, entryQty: $entryQty) {
            id
            description
            ageGroup
            customerType
            shift
            monthQty
            price
            entryQty
        }
    }
`;

const CREATE_MEMBER_PRICE = gql`
    mutation CreateMemberPrice($price: Float!, $customerType: String!, $ageGroup: String!, $description: String!, $shift: String, $entryQty: Float, $monthQty: Float) {
        createMemberPrice(price: $price, customerType: $customerType, ageGroup: $ageGroup, description: $description, shift: $shift, entryQty: $entryQty, monthQty: $monthQty) {
                id
                description
                ageGroup
                customerType
                shift
                monthQty
                price
                entryQty
            }
        }
`;

const DELETE_MEMBER_PRICE = gql`
    mutation DeleteMemberPrice($deleteMemberPriceId: Float!) {
        deleteMemberPrice(id: $deleteMemberPriceId)
    }
`;

// Define TypeScript type for MemberPrice
interface MemberPrice {
    id: number;
    description: string;
    ageGroup: string;
    customerType: string;
    shift: string;
    monthQty: number;
    price: number;
    entryQty: number;
}

export const MemberPriceTable = () => {
    const { data, loading, error, refetch } = useQuery(GET_ALL_PRICES);
    const [memberPrices, setMemberPrices] = useState<MemberPrice[]>([]);

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedMemberPrice, setSelectedMemberPrice] = useState<MemberPrice | null>(null);

    const [updateMemberPrice, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_MEMBER_PRICE, {

        onCompleted: (data) => {
            const updatedMemberPrice = data.updatePrice;
            setMemberPrices((prevPrices) =>
                prevPrices.map((price) =>
                    price.id === updatedMemberPrice.id ? updatedMemberPrice : price
                )
            );
            refetch();
            closeEditModal();
        },
        onError: (error) => {
            console.error("Error updating member price:", error);
            alert(`Failed to update member price: ${error.message}`);
        },
        optimisticResponse: {
            updatePrice: {
                id: selectedMemberPrice?.id ?? 0,
                description: selectedMemberPrice?.description ?? '',
                ageGroup: selectedMemberPrice?.ageGroup ?? '',
                customerType: selectedMemberPrice?.customerType ?? '',
                shift: selectedMemberPrice?.shift ?? '',
                monthQty: selectedMemberPrice?.monthQty ?? 1,
                price: selectedMemberPrice?.price ?? 0,
                entryQty: selectedMemberPrice?.entryQty ?? 0,
                __typename: "MemberPrice",
            },
        },
    });

    // Update state when data is fetched (conditionally within effect, but effect always runs)
    useEffect(() => {
        if (data?.getAllMemberPriceTable) {
            setMemberPrices(data.getAllMemberPriceTable);
        }
    }, [data]);

    // Handle row edit button click
    const handleEdit = (id: number) => {
        const selected = memberPrices.find((price) => price.id === id);
        if (selected) {
            setSelectedMemberPrice(selected);
            setEditModalOpen(true);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (selectedMemberPrice) {
            const { name, value } = e.target;

            let newValue = value;

            // Ensure that entryQty is a positive integer, and no float/decimal values
            if (name === "entryQty") {
                // Check if the value is a positive integer and not a float
                if (/^\d+$/.test(value) || value === "") {
                    // If it's valid, set the new value
                    newValue = value;
                } else {
                    // If not a valid integer, prevent state update
                    return;
                }
            }

            // Update the selectedMemberPrice state
            setSelectedMemberPrice({
                ...selectedMemberPrice,
                [name]: newValue,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure that all required fields in selectedMemberPrice are valid
        if (!selectedMemberPrice) {
            console.error("Selected member price is missing.");
            return;
        }

        const { id, description, ageGroup, customerType, shift, monthQty, price, entryQty } = selectedMemberPrice;

        // Basic validation to ensure required fields are filled in
        if (!description || !ageGroup || !customerType || !shift || !monthQty || !price || !entryQty) {
            alert("Please fill in all the fields.");
            return;
        }

        console.log("Submitting updated member price:", selectedMemberPrice);

        // Call the mutation with the selectedMemberPrice data
        updateMemberPrice({
            variables: {
                updatePriceId: id,
                description: `សមាជិក ${getCustomerTypeInDescription(selectedMemberPrice.customerType)} ${selectedMemberPrice.monthQty}ខែ ${getAgeGroupInDescription(selectedMemberPrice.ageGroup)} (${selectedMemberPrice.price}$)`,
                ageGroup,
                customerType,
                shift,
                monthQty: parseInt(monthQty.toString()),
                price: parseFloat(price.toString()),
                entryQty: parseInt(entryQty.toString())
            },
        }).catch((error) => {
            console.error("Error submitting the update:", error);
            alert("An error occurred while updating the member price.");
        });

        refetch()
    };

    const [deleteMemberPrice] = useMutation(DELETE_MEMBER_PRICE, {
        onCompleted: () => {
            refetch(); // Refetch the data if needed
        },
        onError: (error) => {
            console.error("Error deleting member price:", error);
            alert(`Failed to delete member price: ${error.message}`);
        },
    });


    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this member price?")) {
            deleteMemberPrice({ variables: { deleteMemberPriceId: id } });
        }
    };

    // Define table columns
    const columns: ColumnDef<MemberPrice>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "description", header: "Description" },
        { accessorKey: "ageGroup", header: "Age Group" },
        { accessorKey: "customerType", header: "Customer Type" },
        { accessorKey: "shift", header: "Shift" },
        { accessorKey: "monthQty", header: "Months" },
        {
            accessorKey: "price",
            header: "Price",
            cell: (info) => {
                const value = info.getValue() as number; // Type assertion
                return `$${value.toFixed(2)}`;
            },
        },
        { accessorKey: "entryQty", header: "Entries" },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex gap-2">
                        {/* Edit Icon */}
                        <button
                            onClick={() => handleEdit(row.original.id)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit"
                        >
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {/* Delete Icon */}
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                        >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                );
            },
        },
    ];

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const openCreateModal = () => setCreateModalOpen(true);
    const closeCreateModal = () => setCreateModalOpen(false);

    const [newPriceData, setNewPriceData] = useState<MemberPrice>({
        id: 0,
        description: "",
        ageGroup: "",
        customerType: "",
        shift: "",
        monthQty: 1,
        price: 0,
        entryQty: 1,
    });

    const add_button = (
        <button
            type="button"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-green-500"
            onClick={openCreateModal}
        >
            <PlusCircleIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
            Add
        </button>
    );

    const [createMemberPrice, { loading: createLoading }] = useMutation(CREATE_MEMBER_PRICE, {
        onCompleted: () => {
            // Close the modal here
            setCreateModalOpen(false); // Assuming `setModalOpen` is the state setter to close the modal
            refetch(); // Refetch the data if needed
            setNewPriceData({
                id: 0,
                description: '',
                ageGroup: '',
                customerType: '',
                shift: '',
                monthQty: 1,
                price: 0,
                entryQty: 1,
            });
        },
        onError: (error) => {
            console.error("Error creating member price:", error);
            alert(`Failed to create member price: ${error.message}`);
        },
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { description, ageGroup, customerType, shift, monthQty, price, entryQty } = newPriceData;

        // Validate required fields
        if (!description || !ageGroup || !customerType || !shift || !monthQty || !price || !entryQty) {
            alert("Please fill in all the fields.");
            return;
        }

        createMemberPrice({
            variables: {
                description: `សមាជិក ${getCustomerTypeInDescription(newPriceData.customerType)} ${newPriceData.monthQty}ខែ ${getAgeGroupInDescription(newPriceData.ageGroup)} (${newPriceData.price}$)`,
                ageGroup,
                customerType,
                shift,
                monthQty: parseInt(monthQty.toString(), 10), // Convert to number
                price: parseFloat(price.toString()),        // Convert to number
                entryQty: parseInt(entryQty.toString(), 10), // Convert to number
            },
        });
    };


    const handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setNewPriceData((prev) => ({
            ...prev,
            [name]: name === "monthQty" || name === "price" || name === "entryQty"
                ? parseFloat(value) // Parse numbers for specific fields
                : value,           // Use string for others
        }));
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedMemberPrice(null);
    };

    const getAgeGroupInDescription = (ageGroup: string) => {
        switch (ageGroup) {
            case 'Kid':
                return 'តូច'; // For 'Kid', show 'តូច'
            case 'Adult':
                return 'ធំ'; // For 'Adult', show 'ធំ'
            default:
                return ''; // Empty for default case
        }
    };

    const getCustomerTypeInDescription = (ageGroup: string) => {
        switch (ageGroup) {
            case 'Old':
                return 'ចាស់';
            case 'New':
                return 'ថ្មី';
            default:
                return ''; // Empty for default case
        }
    };

    // Handle loading, error, and display data
    if (loading) return <LoadingPage message="Loading..." />;
    if (error) return <div>Error loading data: {error.message}</div>;

    return (
        <>
            <DataTable columns={columns} data={memberPrices} button={add_button} />
            {isEditModalOpen && selectedMemberPrice && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Edit Member Price</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Description Field - Dynamic with AgeGroup */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={`សមាជិក ${getCustomerTypeInDescription(selectedMemberPrice.customerType)} ${selectedMemberPrice.monthQty}ខែ ${getAgeGroupInDescription(selectedMemberPrice.ageGroup)} (${selectedMemberPrice.price}$)`}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    readOnly // Making it read-only since it's derived from other fields
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">មនុស្ស ធំ ឬ តូច</label>
                                <select
                                    name="ageGroup"
                                    value={selectedMemberPrice.ageGroup}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                >
                                    <option value="Kid">តូច</option>
                                    <option value="Adult">ធំ</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">អតិថិជន ចាស់ ឬ ថ្មី</label>
                                <select
                                    name="customerType"
                                    value={selectedMemberPrice.customerType}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                >
                                    <option value="Old">ចាស់</option>
                                    <option value="New">ថ្មី</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">វេន</label>
                                <select
                                    name="shift"
                                    value={selectedMemberPrice.shift}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                >
                                    <option value="Morning">ព្រឹក</option>
                                    <option value="Full">Full</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">ចំនួនខែ</label>
                                <input
                                    type="number"
                                    name="monthQty"
                                    value={selectedMemberPrice.monthQty}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">តម្លៃ</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={selectedMemberPrice.price}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">ចំនួនចូលបាន</label>
                                <input
                                    type="number"
                                    name="entryQty"
                                    value={selectedMemberPrice.entryQty}
                                    onChange={handleInputChange}
                                    min="1"  // Ensures the number is positive and >= 1
                                    step="1"  // Ensures no decimals are allowed
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="mr-2 text-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-green-500"
                                    disabled={updateLoading}
                                >
                                    {updateLoading ? "Updating..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Create Member Price</h2>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={`សមាជិក ${getCustomerTypeInDescription(newPriceData.customerType)} ${newPriceData.monthQty}ខែ ${getAgeGroupInDescription(newPriceData.ageGroup)} (${newPriceData.price}$)`}  // Combine price, monthQty, and ageGroup into description
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-500"
                                    required
                                    readOnly  // Make the input field read-only
                                    disabled
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">មនុស្ស ធំ ឬ តូច</label>
                                <select
                                    name="ageGroup"
                                    value={newPriceData.ageGroup}
                                    onChange={handleNewInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option value="Kid">តូច</option>
                                    <option value="Adult">ធំ</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">អតិថិជន ចាស់ ឬ ថ្មី</label>
                                <select
                                    name="customerType"
                                    value={newPriceData.customerType}
                                    onChange={handleNewInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option value="Old">ចាស់</option>
                                    <option value="New">ថ្មី</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">វេន</label>
                                <select
                                    name="shift"
                                    value={newPriceData.shift}
                                    onChange={handleNewInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option value="Morning">ព្រឹក</option>
                                    <option value="Full">Full</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">ចំនួនខែ</label>
                                <input
                                    type="number"
                                    name="monthQty"
                                    value={newPriceData.monthQty}
                                    onChange={handleNewInputChange}
                                    min="1"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">តម្លៃ</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={newPriceData.price}
                                    onChange={handleNewInputChange}
                                    min="0"
                                    step="0.01"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">ចំនួនចូលបាន</label>
                                <input
                                    type="number"
                                    name="entryQty"
                                    value={newPriceData.entryQty}
                                    onChange={handleNewInputChange}
                                    min="1"
                                    step="1"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeCreateModal}
                                    className="mr-2 text-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-green-500"
                                    disabled={createLoading}
                                >
                                    {createLoading ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
