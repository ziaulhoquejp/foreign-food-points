const addPoints = async (
memberNo: number
) => {
alert("Clicked: " + memberNo);

const {
data: customer,
error: customerError,
} = await supabase
.from("customers")
.select("*")
.eq("member_no", memberNo)
.single();

console.log("customer:", customer);
console.log(
"customerError:",
customerError
);

if (!customer) return;

const { error: updateError } =
await supabase
.from("customers")
.update({
points: (customer.points || 0) + 10,
})
.eq("member_no", memberNo);

console.log(
"updateError:",
updateError
);

await loadMembers();
};
