jest.setTimeout(10000);

import { ParsedComplaint } from '@utils/ParsedComplaint';
import { ParserComplaints } from '@utils/ParserComplaints';

const mockParsedComplaints = {
	complaints: [
		{
			name: 'Ibuprofen',
			date: '10/25/2020',
			description: '1P6M2SvMCvcyHaH4Q5dHNjj2uaSC3aFqN1',
			picture:
				'iVBORw0KGgoAAAANSUhEUgAAAIkAAABkBAMAAABA0A6mAAAAG1BMVEXd3d0AAABSUlLBwcE3NzeKioqlpaVubm4bGxsixWdPAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA30lEQVRYhe2TwQ6CMBBEN1bKb5B60GOjfEBj492QGK5q8O5Jft92F0yIGAonD/PSDmUKE1gWIgAAAAAAAACIqN/u+NYXhuhujM2N2Q3d/NjLNGVFZEkXYbkfujVlT5FJlJd7XZiboevicLI1lSJPoJ8yVUHKiRuW9GJJeaWY8miDrGyQhkorbgy9sCSmqLrt4kh7TwtTiKsrZbldl6d8qqhOrnPn1yVGZOd4LG3Tuy79G/H13C9rrqon7Tq3jW4rrZSSUm1Dg5Z8Znmwm0eXJZHDqDvnPwIAAAAAAAD8L2+WRR+zNcFMEwAAAABJRU5ErkJggg==',
		},
		{
			name: 'Terazosin Hydrochloride',
			date: '9/26/2020',
			description: '15E1HiYEYGrTrb34TWDQpLRPMwSuvoYEKV',
			picture: null,
		},
		{
			name: 'ESIKA HD COLOR HIGH DEFINITION COLOR SPF 20',
			date: '9/6/2020',
			description: '16QY4xHS5u69cbEwFDYwefsNevLyoaLQDm',
			picture: null,
		},
	],
	height: 1080,
} as ParsedComplaint;

const mockUnparsedComplaints = {
	category: 'Hole',
	complaints: [
		{
			name: 'Ibuprofen',
			date: '10/25/2020',
			description: '1P6M2SvMCvcyHaH4Q5dHNjj2uaSC3aFqN1',
			picture: 'http://dummyimage.com/137x100.png/dddddd/000000',
		},
		{
			name: 'Terazosin Hydrochloride',
			date: '9/26/2020',
			description: '15E1HiYEYGrTrb34TWDQpLRPMwSuvoYEKV',
			picture: null,
		},
		{
			name: 'ESIKA HD COLOR HIGH DEFINITION COLOR SPF 20',
			date: '9/6/2020',
			description: '16QY4xHS5u69cbEwFDYwefsNevLyoaLQDm',
			picture: null,
		},
	],
};

describe('Complaint parser', () => {
	test('Parse complaint successfully', async () => {
		const parser = new ParserComplaints();
		const result = await parser.convertImageToBase64(
			mockUnparsedComplaints.complaints,
		);
		expect(result).toStrictEqual(mockParsedComplaints);
	});
});
